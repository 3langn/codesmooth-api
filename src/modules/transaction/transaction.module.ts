import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { TransactionEntity } from "../../entities/transaction.entity";
import { CourseEntity } from "../../entities/course.entity";
import { UserEntity } from "../../entities/user.entity";
import { LogTransError } from "../../entities/log_transaction.entity";
import { InstructorBalanceEntity } from "../../entities/instructor_balance.entity";
import { MailerModule } from "../mailer/mailer.module";
import { BalanceModule } from "../balance/balance.module";
import { NotificationModule } from "../notification/notification.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity,
      CourseEntity,
      UserEntity,
      LogTransError,
      InstructorBalanceEntity,
    ]),
    MailerModule,
    NotificationModule,
    BalanceModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
