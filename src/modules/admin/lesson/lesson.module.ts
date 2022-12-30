import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonEntity } from "../../../entities/lesson.entity";
import { LessonController as LessonController } from "./lesson.controller";
import { LessonService as LessonService } from "./lesson.service";

@Module({
  imports: [TypeOrmModule.forFeature([LessonEntity])],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
