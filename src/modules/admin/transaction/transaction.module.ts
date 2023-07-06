import { Module } from "@nestjs/common";
import { TransactionEntity } from "../../../entities/transaction.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
