import { HttpStatus, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateTransactionInput } from "./dto/transaction.dto";
import { Cron } from "@nestjs/schedule";
import { TransactionEntity } from "../../../entities/transaction.entity";
import { CourseEntity } from "../../../entities/course.entity";
import { UserEntity } from "../../../entities/user.entity";
import { TransactionStatus } from "../../../common/enum/transaction";
import * as Imap from "node-imap";
import { Observable } from "rxjs";
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
    @InjectDataSource() private datasource: DataSource,
  ) {}

  private imapConfig = {
    user: "cvantnhuquynh@gmail.com",
    password: "jkgviyicbntzowaa",
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

  async transactionSuccess(id: string, tranNo: string): Promise<TransactionEntity> {
    const transaction = await this.getTransactionById(id);
    transaction.status = TransactionStatus.SUCCESS;
    transaction.trans_no = tranNo;

    // TODO: Mail to dev if error and rollback then refund

    const course = await this.courseRepository.findOne({ where: { id: transaction.course_id } });
    if (!course) throw new Error("Không tìm thấy khóa học");

    const buyer = await this.userRepository.findOne({ where: { id: transaction.user_id } });
    if (!buyer) throw new Error("Không tìm thấy người mua");

    if (!course.students) course.students = [];
    course.students.push(buyer);
    course.total_enrollment += 1;
    return await this.datasource.transaction(async (manager) => {
      await manager.save(course);

      return manager.save(transaction);
    });
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
        this.openInbox((err, box) => {
          if (err) throw err;

          this.imap.on("mail", (numNewMsgs) => {
            console.log("Có thư mới đến", ["TEXT", "vào tài khoản"]);
            this.imap.search(
              ["UNSEEN", ["TEXT", "CD123"], ["FROM", "mbebanking@mbbank.com.vn"]],
              (searchErr, results) => {
                if (searchErr) throw searchErr;

                if (results.length === 0) return;

                const fetch = this.imap.fetch(results, { bodies: "" });

                fetch.on("message", (msg, seqno) => {
                  console.log(`Email #${seqno}`);
                  msg.on("body", (stream, info) => {
                    let buffer = "";

                    stream.on("data", (chunk) => {
                      buffer += chunk.toString("utf8");
                    });

                    stream.on("end", () => {
                      console.log("Nội dung email:", buffer);
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
    });
  }

  private openInbox(cb: (err: Error | null, box: Imap.Box) => void) {
    this.imap.openBox("INBOX", false, cb);
  }
}
