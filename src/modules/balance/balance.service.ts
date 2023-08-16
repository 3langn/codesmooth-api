import { InjectRepository } from "@nestjs/typeorm";
import { TransactionEntity } from "../../entities/transaction.entity";
import { Repository } from "typeorm";

export class BalanceService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}
}
