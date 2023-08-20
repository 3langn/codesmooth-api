import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "../../../entities/course.entity";
import { InstructorCourseController } from "./course.controller";
import { InstructorCourseService } from "./course.service";
import { CategoryEntity } from "../../../entities/category.entity";
import { LessonEntity } from "../../../entities/lesson.entity";
import { SectionEntity } from "../../../entities/section.entity";
import { InstructorSectionModule } from "../section/section.module";
import { ReviewEntity } from "../../../entities/review.entity";
import { CacheModule } from "../../cache/cache.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      LessonEntity,
      SectionEntity,
      CategoryEntity,
      ReviewEntity,
    ]),
    forwardRef(() => InstructorSectionModule),
    CacheModule,
  ],
  controllers: [InstructorCourseController],
  providers: [InstructorCourseService],
  exports: [InstructorCourseService],
})
export class InstructorCourseModule {}
