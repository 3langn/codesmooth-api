import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminCourseController } from "./course.controller";
import { AdminCourseService } from "./course.service";
import { CourseEntity } from "../../../entities/course.entity";
import { CategoryEntity } from "../../../entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, CategoryEntity])],
  controllers: [AdminCourseController],
  providers: [AdminCourseService],
})
export class AdminCourseModule {}
