import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CourseEntity } from "../../entities/course.entity";
import { CategoryEntity } from "../../entities/category.entity";
import { queryPagination } from "../../common/utils";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { CourseStatus } from "../../common/enum/course";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCourses(pageOptionsDto: PageOptionsDto): Promise<[CourseEntity[], number]> {
    const qb = this.courseRepository
      .createQueryBuilder("course")
      .select([
        "course",
        "categories.id",
        "categories.name",
        "owner.id",
        "owner.username",
        "owner.email",
        "owner.avatar",
      ])
      .leftJoin("course.categories", "categories")
      .leftJoin("course.owner", "owner")
      .where("course.status = :status", { status: CourseStatus.Published })
      .andWhere("course.deleted_at IS NULL");

    return await queryPagination({ query: qb, o: pageOptionsDto });
  }

  async getCourseById(id: number): Promise<CourseEntity> {
    // select id, title from lessons
    const c = await this.courseRepository
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

    if (!c)
      throw new CustomHttpException({
        message: "Không tìm thấy khóa học",
        statusCode: HttpStatus.NOT_FOUND,
        code: StatusCodesList.NotFound,
      });

    return c;
  }
}
