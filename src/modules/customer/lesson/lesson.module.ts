import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonController as LessonController } from "./lesson.controller";
import { LessonService as LessonService } from "./lesson.service";
import { LessonEntity } from "../../../entities/lesson.entity";
import { CourseEntity } from "../../../entities/course.entity";
import { SectionEntity } from "../../../entities/section.entity";

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity, CourseEntity, SectionEntity])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
