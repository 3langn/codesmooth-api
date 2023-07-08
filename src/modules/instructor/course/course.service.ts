import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ResponseDefault } from "../../../common/dto/response_default";
import { CourseEntity } from "../../../entities/course.entity";
import { SaveCourseDto } from "./dto/create-course.dto";
import { generateId } from "../../../common/generate-nanoid";
import { UserEntity } from "../../../entities/user.entity";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { queryPagination } from "../../../common/utils";
import { PageDto } from "../../../common/dto/page.dto";
import { InstructorCourseReponseDto } from "./dto/course-response.dto";
import { CategoryEntity } from "../../../entities/category.entity";
import { CourseStatus } from "../../../common/enum/course";
import { InstructorGetCoursePageOptionsDto } from "./dto";

@Injectable()
export class InstructorCourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async saveCourse(data: SaveCourseDto, user_id: number) {
    const categories = await this.categoryRepository.find({ where: { id: In(data.category_ids) } });
    const course = this.courseRepository.create({
      categories: categories,
      owner_id: user_id,
      ...data,
    });
    await this.courseRepository.save(course);
  }

  async updateCourse(id: number, data: SaveCourseDto) {
    await this.courseRepository.update(id, data);
  }

  async getCourses(
    pageOptionsDto: InstructorGetCoursePageOptionsDto,
  ): Promise<[CourseEntity[], number]> {
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
      .leftJoin("course.owner", "owner");

    if (pageOptionsDto.q) {
      qb.andWhere("course.name ILIKE :q", { q: `%${pageOptionsDto.q}%` });
    }

    if (pageOptionsDto.status) {
      qb.andWhere("course.status = :status", { status: pageOptionsDto.status });
    }

    qb.andWhere("course.deleted_at IS NULL");

    return await queryPagination({ query: qb, o: pageOptionsDto });
  }

  async getCourseById(id: number, user_id: number): Promise<InstructorCourseReponseDto> {
    // select id, title from lessons
    return await this.courseRepository
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
      // .leftJoin("category.lessons", "lessons")
      .where("course.id = :id", { id })
      .andWhere("course.owner_id = :user_id", { user_id })
      .andWhere("course.deleted_at IS NULL")
      // .orderBy("category.order", "ASC")
      // .addOrderBy("lessons.order", "ASC")
      .getOne();
  }

  async deleteCourseById(id: number) {
    await this.courseRepository.delete(id);
  }

  async submitCourseForReview(id: number) {
    await this.courseRepository.update(id, { status: CourseStatus.Reviewing });
  }
}
