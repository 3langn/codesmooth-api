import { Injectable } from "@nestjs/common";
import { TransactionEntity } from "../../../entities/transaction.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionStatus, TransactionType } from "../../../common/enum/transaction";
import { Repository } from "typeorm";
import { CourseEntity } from "../../../entities/course.entity";
import { UserEntity } from "../../../entities/user.entity";
import { PaymentMethod } from "../../../common/enum/payment-method";

interface CreateTransactionInput {
  user_id: number;
  amount: number;
  type: TransactionType;
  description: string;
  course_id: number;
  course_name: string;
  payment_method: PaymentMethod;
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createTransaction(data: CreateTransactionInput): Promise<TransactionEntity> {
    const transaction = this.transactionRepository.create(data);
    return this.transactionRepository.save(transaction);
  }

  async getTransactionById(id: string): Promise<TransactionEntity> {
    return this.transactionRepository.findOne({ where: { id } });
  }

  async transactionSuccess(id: string): Promise<TransactionEntity> {
    const transaction = await this.getTransactionById(id);
    transaction.status = TransactionStatus.SUCCESS;

    // TODO: Mail to dev if error and rollback then refund

    const course = await this.courseRepository.findOne({ where: { id: transaction.course_id } });
    if (!course) throw new Error("Không tìm thấy khóa học");

    const buyer = await this.userRepository.findOne({ where: { id: transaction.user_id } });
    if (!buyer) throw new Error("Không tìm thấy người mua");

    course.students.push(buyer);
    course.total_enrollment += 1;

    await this.courseRepository.save(course);

    return this.transactionRepository.save(transaction);
  }

  async transactionFail(id: string, reason_code: string): Promise<TransactionEntity> {
    const transaction = await this.getTransactionById(id);
    transaction.status = TransactionStatus.FAILED;
    transaction.failed_reason = reason_code;
    return this.transactionRepository.save(transaction);
  }
}
