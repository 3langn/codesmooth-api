import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonEntity } from "../../../entities/lesson.entity";
import { LessonController as LessonController } from "./lesson.controller";
import { LessonService as LessonService } from "./lesson.service";
import { SectionEntity } from "../../../entities/section.entity";
import { CourseEntity } from "../../../entities/course.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity, SectionEntity, CourseEntity])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class InstructorLessonModule {}
