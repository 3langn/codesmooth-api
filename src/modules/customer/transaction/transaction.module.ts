import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { TransactionEntity } from "../../../entities/transaction.entity";
import { CourseEntity } from "../../../entities/course.entity";
import { UserEntity } from "../../../entities/user.entity";
import { CourseModule } from "../course/course.module";

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, CourseEntity, UserEntity]), CourseModule],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
