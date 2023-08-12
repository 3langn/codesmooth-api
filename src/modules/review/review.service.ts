import { HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { ReviewEntity } from "../../entities/review.entity";
import { DataSource, In, Repository } from "typeorm";
import { CourseEntity } from "../../entities/course.entity";
import { CourseService } from "../customer/course/course.service";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { ReviewCourseRequest } from "./review.dto";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { queryPagination } from "../../common/utils";
import { log } from "console";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @Inject(forwardRef(() => CourseService))
    private readonly courseService: CourseService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getReviews(
    course_id: number,
    pageOptionsDto: PageOptionsDto,
    user_id?: number,
  ): Promise<[any[], number]> {
    const { skip, take } = pageOptionsDto;

    const qb = this.reviewRepository
      .createQueryBuilder("review")
      .select(["review", "user.id", "user.username", "user.avatar", "user.email"])
      .leftJoin("review.user", "user")
      .where("review.course_id = :course_id", { course_id })
      .groupBy("review.id, user.id")
      .orderBy("review.created_at")
      .offset(skip)
      .limit(take);

    const reviews = await qb.getRawMany();

    const count = await this.reviewRepository.count({
      where: {
        course_id,
      },
    });

    const reviewIds = reviews.map((review) => review.review_id);

    const usersLike = await this.dataSource
      .getRepository("review_like_users")
      .createQueryBuilder("like")
      .select(["like.review_id as review_id", "like.user_id as user_id"])
      .where("like.review_id IN (:...ids)", { ids: reviewIds })
      .getRawMany();

    const usersDislike = await this.dataSource
      .getRepository("review_dislike_users")
      .createQueryBuilder("dislike")
      .select(["dislike.review_id as review_id", "dislike.user_id as user_id"])
      .where("dislike.review_id IN (:...ids)", { ids: reviewIds })
      .getRawMany();

    const mapUserLike = usersLike.reduce((acc, cur) => {
      if (!acc[cur.review_id]) {
        acc[cur.review_id] = {
          count: 1,
        };
      } else {
        acc[cur.review_id].count++;
      }

      acc[cur.review_id].is_like = cur.user_id === user_id;
      return acc;
    }, {});

    const mapUserDislike = usersDislike.reduce((acc, cur) => {
      if (!acc[cur.review_id]) {
        acc[cur.review_id] = {
          count: 1,
        };
      } else {
        acc[cur.review_id].count++;
      }

      acc[cur.review_id].is_dislike = cur.user_id === user_id;
      return acc;
    }, {});

    const r = reviews.map((review) => {
      return {
        id: review.review_id,
        rating: review.review_rating,
        comment: review.review_comment,
        created_at: review.review_created_at,
        updated_at: review.review_updated_at,
        user: {
          id: review.user_id,
          username: review.user_username,
          avatar: review.user_avatar,
          email: review.user_email,
        },
        like_count: mapUserLike[review.review_id]?.count || 0,
        dislike_count: mapUserDislike[review.review_id]?.count || 0,
        is_like: mapUserLike[review.review_id]?.is_like || false,
        is_dislike: mapUserDislike[review.review_id]?.is_dislike || false,
      };
    });

    return [r, count];
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

  async dislikeReview(review_id: number, user_id: number) {
    const [d] = await Promise.all([
      this.dataSource.getRepository("review_dislike_users").count({
        where: {
          review_id,
          user_id,
        },
      }),
      this.dataSource.getRepository("review_like_users").delete({
        review_id,
        user_id,
      }),
    ]);

    if (d > 0) {
      await this.dataSource.getRepository("review_dislike_users").delete({
        review_id,
        user_id,
      });
    } else {
      await this.dataSource.getRepository("review_dislike_users").insert({
        review_id,
        user_id,
      });
    }
  }

  async likeReview(review_id: number, user_id: number) {
    const [d] = await Promise.all([
      this.dataSource.getRepository("review_like_users").count({
        where: {
          review_id,
          user_id,
        },
      }),
      this.dataSource.getRepository("review_dislike_users").delete({
        review_id,
        user_id,
      }),
    ]);

    if (d > 0) {
      await this.dataSource.getRepository("review_like_users").delete({
        review_id,
        user_id,
      });
    } else {
      await this.dataSource.getRepository("review_like_users").insert({
        review_id,
        user_id,
      });
    }
  }

  async isReviewed(course_id: number, user_id: number) {
    const review = await this.reviewRepository.findOne({
      where: {
        course_id,
        user_id,
      },
    });

    return !!review;
  }
}
