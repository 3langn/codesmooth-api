import { Module } from "@nestjs/common";
import { SettingsModule } from "./settings/settings.module";
import { PaymentModule } from "./payment/payment.module";
import { TransactionModule } from "../transaction/transaction.module";
import { LessonModule } from "./lesson/lesson.module";
import { SectionModule } from "./section/section.module";

@Module({
  imports: [SettingsModule, PaymentModule, TransactionModule, LessonModule, SectionModule],
})
export class CustomerModule {}
