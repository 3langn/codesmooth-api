import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { Auth } from "../../decorators";
import { ResponseDefault } from "../../common/dto/response_default";
import { ReviewCourseRequest } from "./review.dto";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Auth()
  @Post("/review")
  async reviewCourse(@Body() body: ReviewCourseRequest, @Req() req: any) {
    const data = await this.reviewService.reviewCourse(body, req.user.id);
    return new ResponseDefault("Success", data);
  }

  @Get("/review/:course_id")
  async getReviewCourse(@Param("course_id") course_id: number) {
    const data = await this.reviewService.getReviews(course_id);
    return new ResponseDefault("Success", data);
  }
}
