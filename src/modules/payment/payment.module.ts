import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { TransactionService } from "../admin/transaction/transaction.service";
import { TransactionModule } from "../admin/transaction/transaction.module";

@Module({
  imports: [TransactionModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
