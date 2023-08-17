import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { TransactionEntity } from "../../entities/transaction.entity";
import { CourseEntity } from "../../entities/course.entity";
import { UserEntity } from "../../entities/user.entity";
import { CourseModule } from "../customer/course/course.module";
import { LogTransError } from "../../entities/log_transaction.entity";
import { MailerModule } from "../mailer/mailer.module";
import { InstructorBalanceEntity } from "../../entities/instructor_balance.entity";
import { BalanceEntity } from "../../entities/balance.entity";
import { BalanceModule } from "../balance/balance.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity,
      CourseEntity,
      UserEntity,
      LogTransError,
      InstructorBalanceEntity,
    ]),
    CourseModule,
    MailerModule,
    BalanceModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
