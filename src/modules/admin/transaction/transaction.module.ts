import { Module } from "@nestjs/common";
import { TransactionEntity } from "../../../entities/transaction.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { CourseEntity } from "../../../entities/course.entity";
import { UserEntity } from "../../../entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, CourseEntity, UserEntity])],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
