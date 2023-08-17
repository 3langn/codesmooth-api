import { Module } from "@nestjs/common";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { CourseModule } from "../course/course.module";
import { TransactionModule } from "../../transaction/transaction.module";
import { SettingsModule } from "../settings/settings.module";

@Module({
  imports: [TransactionModule, CourseModule, SettingsModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
