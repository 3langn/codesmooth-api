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

  async getCourses(pageOptionsDto: PageOptionsDto): Promise<[CourseEntity[], number]> {
    const qb = this.courseRepository.createQueryBuilder("course");
    qb.select(["course", "categories.id", "categories.name"]);
    qb.leftJoin("course.categories", "categories");
    qb.where("course.deleted_at IS NULL");

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
        // "lessons.id",
        // "lessons.title",
        // "lessons.isCompleted",
      ])
      .leftJoin("course.categories", "categories")
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
}
