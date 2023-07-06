import { Injectable } from "@nestjs/common";
import { TransactionEntity } from "../../../entities/transaction.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionStatus, TransactionType } from "../../../common/enum/transaction";
import { Repository } from "typeorm";

interface CreateTransactionInput {
  user_id: number;
  amount: number;
  type: TransactionType;
  description: string;
  course_id: number;
  course_name: string;
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
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
    return this.transactionRepository.save(transaction);
  }

  async transactionFail(id: string): Promise<TransactionEntity> {
    const transaction = await this.getTransactionById(id);
    transaction.status = TransactionStatus.FAILED;
    return this.transactionRepository.save(transaction);
  }
}
