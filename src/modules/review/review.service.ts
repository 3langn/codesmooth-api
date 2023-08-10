import { HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewEntity } from "../../entities/review.entity";
import { Repository } from "typeorm";
import { CourseEntity } from "../../entities/course.entity";
import { CourseService } from "../customer/course/course.service";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { ReviewCourseRequest } from "./review.dto";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
  ) {}

  async getReviews(course_id: number) {
    return await this.reviewRepository.find({
      select: {
        comment: true,
        rating: true,
        id: true,
        user: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      where: {
        course_id,
      },
      order: {
        created_at: "DESC",
      },
      relations: {
        user: true,
      },
    });
  }

  async reviewCourse(data: ReviewCourseRequest, user_id: number) {
    const r = await this.courseService.getCourseById(data.course_id, user_id);

    if (!r.is_bought) {
      throw new CustomHttpException({
        code: StatusCodesList.Forbidden,
        message: "Bạn chưa mua khóa học này",
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    const review = await this.reviewRepository.findOne({
      where: {
        course_id: data.course_id,
        user_id,
      },
    });

    if (review) {
      throw new CustomHttpException({
        code: StatusCodesList.BadRequest,
        message: "Bạn đã đánh giá khóa học này",
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const newReview = this.reviewRepository.create({
      course_id: data.course_id,
      user_id,
      rating: data.rating,
      comment: data.comment,
    });

    await this.reviewRepository.save(newReview);
  }

  async averageRating(course_id: number) {
    const reviews = await this.reviewRepository.find({
      where: {
        course_id,
      },
      select: ["rating"],
    });

    const total = reviews.reduce((a, b) => a + b.rating, 0);

    return total / reviews.length;
  }
}
