import { Module, forwardRef } from "@nestjs/common";
import { ReviewEntity } from "../../entities/review.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CourseModule } from "../customer/course/course.module";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity]), forwardRef(() => CourseModule)],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
