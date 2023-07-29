import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, IsNull, Not, Repository } from "typeorm";
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
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";
import { SectionService } from "../section/section.service";

@Injectable()
export class InstructorCourseService {
  private logger = new Logger(InstructorCourseService.name);

  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private sectionService: SectionService,
  ) {}

  async createCourse(data: SaveCourseDto, user_id: number) {
    try {
      const categories = await this.categoryRepository.find({
        where: { id: In(data.category_ids) },
      });
      const course = this.courseRepository.create({
        categories: categories,
        owner_id: user_id,
        base_price: data.price,
        ...data,
      });
      const c = await this.courseRepository.save(course);
      await this.sectionService.createSection(
        {
          course_id: c.id,
          order: 1,
        },
        user_id,
      );
    } catch (error) {
      this.logger.error(error, error.stack);
    }
  }

  async updateCourse(id: number, data: SaveCourseDto, user_id: number) {
    const { category_ids, ...update } = data;
    const categories = await this.categoryRepository.find({
      where: { id: In(category_ids) },
    });

    // check published has draft
    const course = await this.courseRepository.findOne({
      where: { id, owner_id: user_id },
    });

    if (!course) {
      throw new CustomHttpException({
        message: "Course not found",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    course.categories = categories;
    for (const key in update) {
      course[key] = update[key];
    }
    await this.courseRepository.save(course);
  }

  async getCourses(
    pageOptionsDto: InstructorGetCoursePageOptionsDto,
    user_id: number,
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
      .leftJoin("course.owner", "owner")
      .where("course.owner_id = :user_id", { user_id })
      .andWhere("course.published_at IS NULL");

    if (pageOptionsDto.q) {
      qb.andWhere("course.name ILIKE :q", { q: `%${pageOptionsDto.q}%` });
    }

    if (pageOptionsDto.status) {
      qb.andWhere("course.status = :status", { status: pageOptionsDto.status });
    }

    qb.andWhere("course.deleted_at IS NULL");

    return await queryPagination({ query: qb, o: pageOptionsDto });
  }

  async countCourse(user_id: number) {
    const [allCount, publishedCount, reviewingCount, rejectedCount] = await Promise.all([
      this.courseRepository.count({
        where: { owner_id: user_id, published_at: IsNull() },
      }),
      // this.courseRepository.count({ where: { status: CourseStatus.Draft, owner_id: user_id } }),
      this.courseRepository.count({
        where: { status: CourseStatus.Published, owner_id: user_id, published_at: IsNull() },
      }),
      this.courseRepository.count({ where: { status: CourseStatus.Reviewing, owner_id: user_id } }),
      this.courseRepository.count({ where: { status: CourseStatus.Rejected, owner_id: user_id } }),
    ]);

    return {
      all: allCount,
      [CourseStatus.Published]: publishedCount,
      [CourseStatus.Reviewing]: reviewingCount,
      [CourseStatus.Rejected]: rejectedCount,
      [CourseStatus.Draft]: allCount - publishedCount - reviewingCount - rejectedCount,
    };
  }

  async getCourseById(id: number, user_id: number): Promise<InstructorCourseReponseDto> {
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
        "sections.id",
        "sections.title",
        "sections.order",
        "sections.type",
        "lessons.id",
        "lessons.title",
        "lessons.order",
        "lessons.section_id",
        // "lessons.id",
        // "lessons.title",
        // "lessons.isCompleted",
      ])
      .leftJoin("course.categories", "categories")
      .leftJoin("course.owner", "owner")
      .leftJoin("course.sections", "sections")
      .leftJoin("sections.lessons", "lessons")
      .where("course.id = :id", { id })
      .andWhere("course.owner_id = :user_id", { user_id })
      .andWhere("course.deleted_at IS NULL")
      .orderBy("sections.order", "ASC")
      .addOrderBy("lessons.order", "ASC")
      .getOne();

    if (!c) {
      throw new CustomHttpException({
        message: "Course not found",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return c;
  }

  async deleteCourseById(id: number, user_id: number) {
    await this.courseRepository.delete({ id, owner_id: user_id });
  }

  async submitCourseForReview(id: number, user_id: number) {
    const c = await this.courseRepository.findOne({ where: { id, owner_id: user_id } });
    if (!c) {
      throw new CustomHttpException({
        message: "Course not found",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    if (c.status !== CourseStatus.Draft && !c.published_course_id) {
      throw new CustomHttpException({
        message: "Course is not draft",
        code: StatusCodesList.BadRequest,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    if (c.published_course_id) {
      await this.courseRepository.update({ id: c.published_course_id }, { draft_course_id: c.id });
    }
    await this.courseRepository.update(id, { status: CourseStatus.Reviewing, owner_id: user_id });
  }

  async isCourseOwner(course_id: number, user_id: number) {
    return await this.courseRepository.findOne({ where: { id: course_id, owner_id: user_id } });
  }
}
