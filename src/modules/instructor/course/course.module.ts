import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "../../../entities/course.entity";
import { InstructorCourseController } from "./course.controller";
import { InstructorCourseService } from "./course.service";
import { CategoryEntity } from "../../../entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, CategoryEntity])],
  controllers: [InstructorCourseController],
  providers: [InstructorCourseService],
})
export class InstructorCourseModule {}
