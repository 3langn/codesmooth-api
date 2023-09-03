import { Module } from "@nestjs/common";
import { CategoryModule } from "./category/category.module";
import { LessonModule } from "./lesson/lesson.module";
import { SectionModule } from "./section/section.module";
import { AdminCourseModule } from "./course/course.module";
import { AdminSettingsModule } from "./setting/setting.module";
import { AdminTransactionModule } from "./transaction/transaction.module";
import { AdminBalanceModule } from "./balance/balance.module";
import { TagModule } from "./tag/tag.module";

@Module({
  imports: [
    LessonModule,
    SectionModule,
    AdminSettingsModule,
    CategoryModule,
    AdminCourseModule,
    AdminTransactionModule,
    AdminBalanceModule,
    TagModule,
  ],
})
export class AdminModule {}
