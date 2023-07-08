import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { CourseEntity } from "../../entities/course.entity";
import { CategoryEntity } from "../../entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CourseEntity, CategoryEntity])],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
