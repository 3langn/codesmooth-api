import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseEntity } from "../../../entities/course.entity";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { CategoryEntity } from "../../../entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, CategoryEntity])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class InstructorCourseModule {}
