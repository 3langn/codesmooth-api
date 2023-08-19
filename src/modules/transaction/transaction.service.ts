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
import { BalanceService } from "../balance/balance.service";
import { MailerService } from "../mailer/mailer.service";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { NotificationService } from "../notification/notification.service";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
@Injectable()
export class TransactionService {
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
    private configService: ApiConfigService,
    private notiService: NotificationService,
  ) {
    this.imap = new Imap(configService.imapConfig);
    this.observeNewEmails().subscribe((numNewMsgs) => {
      console.log("Có thư mới", numNewMsgs);
    });
  }

  private imap: Imap;

  async createTransaction(data: CreateTransactionInput): Promise<TransactionEntity> {
    const transaction = this.transactionRepository.create(data);
    return this.transactionRepository.save(transaction);
  }

  async getTransactionById(id: string): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async transactionSuccess(
    transaction: TransactionEntity,
    tranNo?: string,
    bankTime?: string,
  ): Promise<TransactionEntity> {
    transaction.status = TransactionStatus.SUCCESS;
    transaction.trans_no = tranNo;
    transaction.bank_time = bankTime;

    // TODO: Mail to dev if error and rollback then refund

    const co = this.courseRepository.findOne({ where: { id: transaction.course_id } });
    const bu = this.userRepository.findOne({ where: { id: transaction.user_id } });

    const [course, buyer] = await Promise.all([co, bu]);
    if (!course)
      throw new CustomHttpException({
        message: "Không tìm thấy khóa học",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });
    if (!buyer)
      throw new CustomHttpException({
        message: "Không tìm thấy người dùng",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });

    if (!course.students) course.students = [];
    course.students.push(buyer);
    course.total_enrollment += 1;

    try {
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

      await this.notiService.notifyPayCourseResult(course, transaction, true);

      this.mailerService.sendMailNotiPaymentSuccess(course, buyer, transaction);

      return r;
    } catch (error) {
      this.transactionFail(transaction, course, error.message, bankTime);
      throw error;
    }
  }

  async transactionFail(
    trans: TransactionEntity,
    course: CourseEntity,
    reason_code: string,
    bank_time: string,
  ) {
    await this.notiService.notifyPayCourseResult(course, trans, false);

    this.mailerService.sendMailNotiPaymentFailed(
      {
        amount: trans.amount,
        courseId: trans.course_id,
        courseName: trans.course_name,
        paymentMethod: trans.payment_method,
        time: bank_time,
        transId: trans.id,
        username: trans.user.username,
      },
      trans.user.email,
    );
    this.transactionRepository.update(trans.id, {
      status: TransactionStatus.FAILED,
      failed_reason: reason_code,
      trans_no: trans.trans_no,
    });
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
        console.log("Kết nối imap thành công");

        this.openInbox(async (err, box) => {
          if (err) throw err;
          this.imap.on("mail", (numNewMsgs) => {
            this.imap.search(
              ["UNSEEN", ["OR", ["FROM", "support@timo.vn"], ["FROM", "langn128@gmail.com"]]], // TODO: Need set env
              (searchErr, results) => {
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
                        const course = await this.courseRepository.findOne({
                          where: {
                            id: trans.course_id,
                          },
                        });
                        if (trans.amount !== amount) {
                          await this.transactionFail(
                            trans,
                            course,
                            `Số tiền không khớp. Số tiền cần thanh toán ${trans.amount} - Số tiền thanh toán ${amount} `,
                            timebanktrans,
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
                          await this.transactionSuccess(trans, null, timebanktrans);
                        } catch (error) {
                          log.message = error.message;
                          await this.logRepository.save(log);
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
              },
            );
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
      console.log("Đang kết nối đến mail server");
    });
  }

  private openInbox(cb: (err: Error | null, box: Imap.Box) => void) {
    this.imap.openBox("INBOX", false, cb);
  }
}
