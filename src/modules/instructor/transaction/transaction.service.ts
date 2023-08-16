import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { TransactionEntity } from "../../../entities/transaction.entity";
import { CourseEntity } from "../../../entities/course.entity";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { queryPagination } from "../../../common/utils";
import { TransactionStatus } from "../../../common/enum/transaction";
@Injectable()
export class TransactionService {
  private logger = new Logger(TransactionService.name);
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    @InjectDataSource() private datasource: DataSource,
  ) {}

  async instructorTransactions(instructor_id: number, pageOptionsDto: PageOptionsDto) {
    const qb = this.transactionRepository
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.created_at",
        "transaction.updated_at",
        "transaction.amount",
        "transaction.instructor_income",
        "transaction.trans_no",
        "transaction.status",
        "transaction.discount",
        "course.id",
        "course.name",
        "course.thumbnail",
        "user.id",
        "user.username",
        "user.email",
        "user.avatar",
      ])
      .leftJoin("transaction.course", "course")
      .leftJoin("transaction.user", "user")
      .where("transaction.instructor_id = :instructor_id AND transaction.status = :status", {
        instructor_id,
        status: TransactionStatus.SUCCESS,
      });

    const transactions = await queryPagination({ query: qb, o: pageOptionsDto });

    return transactions;
  }

  async totalIncome(instructor_id: number) {
    const qb = this.transactionRepository
      .createQueryBuilder("transaction")
      .select("SUM(transaction.instructor_income)", "total_income")
      .where("transaction.instructor_id = :instructor_id AND transaction.status = :status", {
        instructor_id,
        status: TransactionStatus.SUCCESS,
      });

    const total_income = await qb.getRawOne();

    return {
      total_income: Number(total_income.total_income),
    };
  }
}
