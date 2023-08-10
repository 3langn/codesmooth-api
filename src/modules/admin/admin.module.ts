import { Module } from "@nestjs/common";
import { CategoryModule } from "./category/category.module";
import { LessonModule } from "./lesson/lesson.module";
import { SectionModule } from "./section/section.module";
import { AdminCourseModule } from "./course/course.module";
import { AdminSettingsModule } from "./setting/setting.module";

@Module({
  imports: [LessonModule, SectionModule, AdminSettingsModule, CategoryModule, AdminCourseModule],
})
export class AdminModule {}
