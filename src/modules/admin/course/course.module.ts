import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminCourseController } from "./course.controller";
import { AdminCourseService } from "./course.service";
import { CourseEntity } from "../../../entities/course.entity";
import { CategoryEntity } from "../../../entities/category.entity";
import { SectionEntity } from "../../../entities/section.entity";
import { LessonEntity } from "../../../entities/lesson.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, CategoryEntity, SectionEntity, LessonEntity])],
  controllers: [AdminCourseController],
  providers: [AdminCourseService],
})
export class AdminCourseModule {}
