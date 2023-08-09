import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateTransactionInput } from "./dto/transaction.dto";
import { TransactionEntity } from "../../entities/transaction.entity";
import { CourseEntity } from "../../entities/course.entity";
import { UserEntity } from "../../entities/user.entity";
import { CourseService } from "../course/course.service";
import { TransactionStatus } from "../../common/enum/transaction";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    private readonly courseService: CourseService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectDataSource() private datasource: DataSource,
  ) {}

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
}
