import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { TransactionEntity } from "../../../entities/transaction.entity";
import { LogTransError } from "../../../entities/log_transaction.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity, LogTransError])],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class AdminTransactionModule {}
