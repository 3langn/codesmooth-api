import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseCategoryEntity } from "../../../entities/course-category.entity";
import { CourseCatController as CourseCategoryController } from "./course-category.controller";
import { CourseCategoryService } from "./course-category.service";

@Module({
  imports: [TypeOrmModule.forFeature([CourseCategoryEntity])],
  controllers: [CourseCategoryController],
  providers: [CourseCategoryService],
})
export class CourseCategoryModule {}
