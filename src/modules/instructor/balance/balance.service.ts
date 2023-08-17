import { Injectable, Logger } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { TransactionEntity } from "../../../entities/transaction.entity";
import { CourseEntity } from "../../../entities/course.entity";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { queryPaginationTakeSkip } from "../../../common/utils";
import { TransactionStatus } from "../../../common/enum/transaction";
import { InstructorBalanceHistoryEntity } from "../../../entities/instructor_balance_history.entity";
import { InstructorBalanceEntity } from "../../../entities/instructor_balance.entity";
@Injectable()
export class InstructorBalanceService {
  private logger = new Logger(InstructorBalanceService.name);
  constructor(
    @InjectRepository(InstructorBalanceHistoryEntity)
    private readonly instructorBalanceHistoryRepository: Repository<InstructorBalanceHistoryEntity>,
    @InjectRepository(InstructorBalanceEntity)
    private readonly instructorBalanceRepository: Repository<InstructorBalanceEntity>,
  ) {}

  async instructorBalanceHistory(instructor_id: number, pageOptionsDto: PageOptionsDto) {
    const qb = this.instructorBalanceHistoryRepository
      .createQueryBuilder("balance_history")
      .select([
        "balance_history",
        "course.id",
        "course.name",
        "course.thumbnail",
        "user.id",
        "user.username",
        "user.email",
        "user.avatar",
      ])
      .leftJoin("balance_history.course", "course")
      .leftJoin("balance_history.user", "user")
      .where("balance_history.instructor_id = :instructor_id", {
        instructor_id,
      });

    return await queryPaginationTakeSkip({ query: qb, o: pageOptionsDto });
  }

  async getBalance(instructor_id: number) {
    const qb = this.instructorBalanceRepository.findOne({
      where: {
        instructor_id,
      },
    });
    return await qb;
  }
}
