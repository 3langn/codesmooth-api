import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, Repository } from "typeorm";
import { ListCourseQueryDto } from "./dto/list-course.dto";
import { CourseEntity } from "../../../entities/course.entity";
import { CategoryEntity } from "../../../entities/category.entity";
import { CourseStatus } from "../../../common/enum/course";
import { queryPagination } from "../../../common/utils";
import { generateId } from "../../../common/generate-nanoid";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";

@Injectable()
export class AdminCourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCourses(pageOptionsDto: ListCourseQueryDto): Promise<[CourseEntity[], number]> {
    const qb = this.courseRepository
      .createQueryBuilder("course")
      .select(["course", "categories.id", "categories.name"])
      .leftJoinAndSelect("course.categories", "categories")
      .leftJoinAndSelect("course.owner", "owner")
      .where("course.deleted_at IS NULL");

    if (pageOptionsDto.status) {
      qb.andWhere("course.status = :status", { status: pageOptionsDto.status });
    } else {
      qb.andWhere("course.status != :status", { status: CourseStatus.Draft })
        .andWhere("course.published_course_id IS NULL")
        .andWhere("course.draft_course_id IS NULL");
    }

    if (pageOptionsDto.category_id) {
      qb.andWhere("categories.id = :category_id", { category_id: pageOptionsDto.category_id });
    }

    if (pageOptionsDto.owner_id) {
      qb.andWhere("owner.id = :owner_id", { owner_id: pageOptionsDto.owner_id });
    }

    if (pageOptionsDto.name) {
      qb.andWhere("course.name ILIKE :name", { name: `%${pageOptionsDto.name}%` });
    }

    return await queryPagination({ query: qb, o: pageOptionsDto });
  }

  async getCourseById(id: number, user_id: number): Promise<any> {
    // select id, title from lessons
    return await this.courseRepository
      .createQueryBuilder("course")
      .select([
        "course",
        "categories.id",
        "categories.name",
        "owner",
        // "lessons.id",
        // "lessons.title",
        // "lessons.isCompleted",
      ])
      .leftJoin("course.categories", "categories")
      .leftJoin("course.owner", "owner")
      .where("course.status = :status", { status: CourseStatus.Published })
      // .leftJoin("category.lessons", "lessons")
      .andWhere("course.id = :id", { id })
      .andWhere("course.deleted_at IS NULL")
      // .orderBy("category.order", "ASC")
      // .addOrderBy("lessons.order", "ASC")
      .getOne();
  }

  async publishCourse(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ["owner"],
    });

    if (!course)
      throw new CustomHttpException({
        message: "Course not found",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });

    if (course.published_course_id) {
      const p = await this.courseRepository.findOne({
        where: { id: course.published_course_id },
      });

      if (!p) {
        throw new CustomHttpException({
          message: "Course not found",
          code: StatusCodesList.NotFound,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      p.base_price = course.base_price;
      p.categories = course.categories;
      p.description = course.description;
      p.draft_course_id = null;
      p.name = course.name;
      p.price = course.price;
      p.requirements = course.requirements;
      p.target_audience = course.target_audience;
      p.thumbnail = course.thumbnail;
      p.feedback_email = course.feedback_email;
      p.objectives = course.objectives;
      p.short_description = course.short_description;
      p.published_at = new Date();

      await this.courseRepository.save(p);
      return;
    }

    const publishedCourse = {
      ...course,
      id: generateId(9),
      status: CourseStatus.Published,
      published_at: new Date(),
    };

    const p = await this.courseRepository.save(publishedCourse);
    await this.courseRepository.update(
      {
        id,
      },
      {
        published_course_id: p.id,
        status: CourseStatus.Draft,
      },
    );
  }

  // TODO: Reject note for instructor
  async rejectCourse(id: number) {
    await this.courseRepository.update(id, { status: CourseStatus.Rejected });
  }

  async countCourse() {
    const [allCount, publishedCount, reviewingCount, rejectedCount] = await Promise.all([
      this.courseRepository.count({ where: { status: Not(In([CourseStatus.Draft])) } }),
      this.courseRepository.count({ where: { status: CourseStatus.Published } }),
      this.courseRepository.count({ where: { status: CourseStatus.Reviewing } }),
      this.courseRepository.count({ where: { status: CourseStatus.Rejected } }),
    ]);

    return {
      all: allCount,
      [CourseStatus.Published]: publishedCount,
      [CourseStatus.Reviewing]: reviewingCount,
      [CourseStatus.Rejected]: rejectedCount,
    };
  }
}
