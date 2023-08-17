import { HttpStatus, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateTransactionInput } from "./dto/transaction.dto";
import { Cron } from "@nestjs/schedule";
import { TransactionEntity } from "../../entities/transaction.entity";
import { CourseEntity } from "../../entities/course.entity";
import { UserEntity } from "../../entities/user.entity";
import { TransactionStatus } from "../../common/enum/transaction";
import * as Imap from "node-imap";
import { Observable } from "rxjs";
import { LogTransError } from "../../entities/log_transaction.entity";
import { MailerService } from "../mailer/mailer.service";
import { BalanceEntity } from "../../entities/balance.entity";
import { InstructorBalanceEntity } from "../../entities/instructor_balance.entity";
import { BalanceService } from "../balance/balance.service";
@Injectable()
export class TransactionService implements OnModuleInit {
  private logger = new Logger(TransactionService.name);
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(LogTransError)
    private readonly logRepository: Repository<LogTransError>,
    @InjectDataSource() private datasource: DataSource,
    private mailerService: MailerService,
    private balanceService: BalanceService,
  ) {}

  private imapConfig = {
    user: "3langn@gmail.com",
    password: "uvjsxzoihsslpffv",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
  };

  private imap: Imap;

  onModuleInit() {
    this.imap = new Imap(this.imapConfig);
    this.observeNewEmails().subscribe((numNewMsgs) => {
      console.log("Có thư mới", numNewMsgs);
    });
  }

  async createTransaction(data: CreateTransactionInput): Promise<TransactionEntity> {
    const transaction = this.transactionRepository.create(data);
    return this.transactionRepository.save(transaction);
  }

  async getTransactionById(id: string): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async transactionSuccess(
    id: string,
    tranNo?: string,
    bankTime?: string,
  ): Promise<TransactionEntity> {
    try {
      const transaction = await this.getTransactionById(id);
      transaction.status = TransactionStatus.SUCCESS;
      transaction.trans_no = tranNo;
      transaction.bank_time = bankTime;

      // TODO: Mail to dev if error and rollback then refund

      const co = this.courseRepository.findOne({ where: { id: transaction.course_id } });
      const bu = this.userRepository.findOne({ where: { id: transaction.user_id } });

      const [course, buyer] = await Promise.all([co, bu]);
      if (!course) throw new Error("Không tìm thấy khóa học");
      if (!buyer) throw new Error("Không tìm thấy người mua");

      if (!course.students) course.students = [];
      course.students.push(buyer);
      course.total_enrollment += 1;
      const r = await this.datasource.transaction(async (manager) => {
        await manager.save(course);
        await this.balanceService.transactionSuccess(
          manager,
          course.owner_id,
          transaction,
          buyer.id,
        );
        return manager.save(transaction);
      });
      this.mailerService.sendMailNotiPaymentSuccess(
        {
          amount: transaction.amount,
          courseId: course.id,
          courseName: course.name,
          paymentMethod: transaction.payment_method,
          time: transaction.bank_time,
          transId: transaction.id,
          username: buyer.username,
        },
        buyer.email,
      );

      return r;
    } catch (error) {
      this.transactionFail(id, tranNo, error.message);
      throw error;
    }
  }

  async transactionFail(
    id: string,
    tranNo: string,
    reason_code: string,
  ): Promise<TransactionEntity> {
    const transaction = await this.getTransactionById(id);
    transaction.status = TransactionStatus.FAILED;
    transaction.trans_no = tranNo;
    transaction.failed_reason = reason_code;

    await this.mailerService.sendMailNotiPaymentFailed(
      {
        amount: transaction.amount,
        courseId: transaction.course_id,
        courseName: transaction.course_name,
        paymentMethod: transaction.payment_method,
        time: transaction.bank_time,
        transId: transaction.id,
        username: transaction.user.username,
      },
      transaction.user.email,
    );
    return this.transactionRepository.save(transaction);
  }

  async getExistedTransactionByCourseIdAndUserId(
    courseId: number,
    userId: number,
  ): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({
      where: { course_id: courseId, user_id: userId },
    });
  }

  // CRON JOB per 1 minute
  @Cron("0 */1 * * * *")
  async transactionExpire() {
    if (process.env.NODE_ENV === "local") return;
    const transactions = await this.transactionRepository.find({
      where: { status: TransactionStatus.PENDING },
    });
    const now = new Date();
    transactions.forEach(async (transaction) => {
      const created_at = new Date(transaction.created_at);
      const diff = now.getTime() - created_at.getTime();
      if (diff > 17 * 60 * 1000) {
        transaction.status = TransactionStatus.EXPIRED;
        transaction.failed_reason = "Quá thời gian thanh toán";
        await this.transactionRepository.save(transaction);
      }
    });
  }

  public observeNewEmails(): Observable<number> {
    return new Observable<number>((observer) => {
      this.imap.once("ready", () => {
        this.openInbox(async (err, box) => {
          if (err) throw err;
          this.imap.on("mail", (numNewMsgs) => {
            this.imap.search(["UNSEEN", ["FROM", "support@timo.vn"]], (searchErr, results) => {
              if (searchErr) throw searchErr;

              if (results.length === 0) return;

              const fetch = this.imap.fetch(results, { bodies: "" });

              fetch.on("message", (msg, seqno) => {
                msg.on("body", async (stream, info) => {
                  let buffer = "";

                  stream.on("data", (chunk) => {
                    buffer += chunk.toString("utf8");
                  });

                  stream.on("end", async () => {
                    console.log("Nội dung email:", buffer);
                    const regex = /CDs.*?\e/g;

                    const matches = buffer.match(regex);
                    if (!matches) {
                      this.logger.error("Không match được mã giao dịch");
                    }
                    if (matches) {
                      const tranId = matches[0];

                      const regexAmountText =
                        /T=C3=A0i kho=E1=BA=A3n Spend Account v=E1=BB=ABa t=C4=83ng (.*?VND(?:\s|$))/s;

                      const matchesAmountText = buffer.match(regexAmountText);
                      if (!matchesAmountText) {
                        return;
                      }

                      // bỏ xuống dòng
                      const amount = Number(
                        matchesAmountText[0]
                          .replace(/\r?\n|\r/g, "")
                          .replace(
                            "T=C3=A0i kho=E1=BA=A3n Spend Account v=E1=BB=ABa t=C4=83ng ",
                            "",
                          )
                          .replace(" VND ", "")
                          .replace(`=.`, ""),
                      );

                      if (!amount) return;
                      const regexContent = /A3:(.*?Timo(?:\s|$))/s;

                      const matchesContent = buffer.match(regexContent);

                      if (!matchesContent) {
                        this.logger.error("Không tìm thấy nội dung giao dịch");
                        return;
                      }

                      const timebanktrans = buffer.match(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}/)[0];

                      const trans = await this.transactionRepository.findOne({
                        where: {
                          id: tranId,
                        },
                      });
                      const log = this.logRepository.create({
                        transfer_amount: amount,
                        content:
                          matchesContent[0] +
                          "TransId : " +
                          tranId +
                          " - Amount : " +
                          amount +
                          " - Time : " +
                          timebanktrans,
                      });

                      if (!trans) {
                        log.message = "Không tìm thấy giao dịch";
                        await this.logRepository.save(log);
                        return;
                      }

                      if (trans.amount !== amount) {
                        await this.transactionFail(
                          tranId,
                          null,
                          `Số tiền không khớp. Số tiền cần thanh toán ${trans.amount} - Số tiền thanh toán ${amount} `,
                        );
                        return;
                      }

                      if (trans.amount !== amount) {
                        log.message = `Số tiền không khớp. Số tiền cần thanh toán ${trans.amount} - Số tiền thanh toán ${amount} `;
                        await this.logRepository.save(log);
                        return;
                      }

                      if (trans.status !== TransactionStatus.PENDING) {
                        log.message = "Trạng thái giao dịch không hợp lệ " + trans.status;
                        await this.logRepository.save(log);
                        return;
                      }

                      try {
                        await this.transactionSuccess(tranId, null, timebanktrans);
                      } catch (error) {
                        this.logger.error(error);
                      }
                    }
                  });
                });
              });

              this.imap.setFlags(results, ["\\Seen"], (flagErr) => {
                if (flagErr) throw flagErr;
                console.log("Đã đánh dấu email đã đọc.");
              });

              fetch.once("end", () => {
                console.log("Tất cả email đã được xử lý.");
              });
            });
          });
        });
      });

      this.imap.once("error", (err) => {
        console.log(err);
        observer.error(err);
      });

      this.imap.once("end", () => {
        console.log("Kết nối đã đóng");
        observer.complete();
      });

      this.imap.connect();
    });
  }

  private openInbox(cb: (err: Error | null, box: Imap.Box) => void) {
    this.imap.openBox("INBOX", false, cb);
  }
}
