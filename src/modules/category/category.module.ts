import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SampleEntity } from "../../entities/sample.entity";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { CategoryEntity } from "../../entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class InstructorCategoryModule {}
