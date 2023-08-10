import { Module } from "@nestjs/common";
import { CategoryModule } from "./category/category.module";
import { LessonModule } from "./lesson/lesson.module";
import { SettingsModule } from "../customer/settings/settings.module";
import { SectionModule } from "./section/section.module";
import { AdminCourseModule } from "./course/course.module";

@Module({
  imports: [LessonModule, SectionModule, SettingsModule, CategoryModule, AdminCourseModule],
})
export class AdminModule {}
