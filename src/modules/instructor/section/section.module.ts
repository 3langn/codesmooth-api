import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionEntity } from "../../../entities/section.entity";
import { SectionController } from "./section.controller";
import { SectionService } from "./section.service";
import { InstructorCourseModule } from "../course/course.module";
import { LessonEntity } from "../../../entities/lesson.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([SectionEntity, LessonEntity]),
    forwardRef(() => InstructorCourseModule),
  ],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}
