import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectConnection, InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, Repository } from "typeorm";
import { CourseEntity } from "../../entities/course.entity";
import { CategoryEntity } from "../../entities/category.entity";
import { queryPagination } from "../../common/utils";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { CourseStatus } from "../../common/enum/course";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { CourseReponseDto } from "./dto/course-response.dto";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectDataSource() private readonly datasource: DataSource,
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

  async getCourseById(id: number, user_id?: number): Promise<CourseReponseDto> {
    // select id, title from lessons
    const c = await this.courseRepository
      .createQueryBuilder("course")
      .select([
        "course",
        "categories.id",
        "categories.name",
        "owner.id",
        "owner.username",
        "owner.email",
        "owner.avatar",
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
      .getOne();
    // .orderBy("category.order", "ASC")
    // .addOrderBy("lessons.order", "ASC")

    // query count from join table where user_id = 1 and course_id = 1
    let count = 0;
    if (user_id) {
      count = await this.datasource.createEntityManager().count("course_student", {
        where: {
          student_id: user_id,
          course_id: id,
        },
      });
    }

    if (!c)
      throw new CustomHttpException({
        message: "Không tìm thấy khóa học",
        statusCode: HttpStatus.NOT_FOUND,
        code: StatusCodesList.NotFound,
      });

    return {
      ...c,
      is_bought: count > 0,
    };
  }
}
