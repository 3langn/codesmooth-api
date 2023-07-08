import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { TransactionModule } from "../admin/transaction/transaction.module";
import { CourseModule } from "../course/course.module";

@Module({
  imports: [TransactionModule, CourseModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
