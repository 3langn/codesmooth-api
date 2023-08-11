import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { ReviewService } from "./review.service";
import { Auth } from "../../decorators";
import { ResponseDefault } from "../../common/dto/response_default";
import { ReviewCourseRequest } from "./review.dto";
import { PageOptionsDto } from "../../common/dto/page-options.dto";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Auth()
  @Post("/")
  async reviewCourse(@Body() body: ReviewCourseRequest, @Req() req: any) {
    const data = await this.reviewService.reviewCourse(body, req.user.id);
    return new ResponseDefault("Success", data);
  }

  @Auth([], {
    public: true,
  })
  @Get("/:course_id")
  async getReviewCourse(
    @Param("course_id") course_id: number,
    @Query() query: PageOptionsDto,
    @Req() req: any,
  ) {
    const data = await this.reviewService.getReviews(course_id, query, req.user?.id);
    return new ResponseDefault("Success", data);
  }

  @Auth()
  @Post("/like/:review_id")
  async likeReview(@Param("review_id") review_id: number, @Req() req: any) {
    const data = await this.reviewService.likeReview(review_id, req.user.id);
    return new ResponseDefault("Success", data);
  }

  @Auth()
  @Post("/dislike/:review_id")
  async dislikeReview(@Param("review_id") review_id: number, @Req() req: any) {
    const data = await this.reviewService.dislikeReview(review_id, req.user.id);
    return new ResponseDefault("Success", data);
  }
}
