import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { TransactionEntity } from "../../../entities/transaction.entity";
import { LogTransError } from "../../../entities/log_transaction.entity";
import { DataSource, Repository } from "typeorm";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { queryPagination } from "../../../common/utils";

@Injectable()
export class TransactionService {
  private logger = new Logger(TransactionService.name);
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(LogTransError)
    private readonly logRepository: Repository<LogTransError>,
  ) {}

  async getListTransaction(o: PageOptionsDto) {
    const qb = this.transactionRepository
      .createQueryBuilder("transaction")
      .select([
        "transaction",
        "course.id",
        "course.name",
        "course.price",
        "user.id",
        "user.email",
        "user.username",
      ])
      .leftJoin("transaction.course", "course")
      .leftJoin("transaction.user", "user");

    return await queryPagination({ query: qb, o });
  }
}
