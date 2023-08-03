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
import { SectionEntity } from "../../../entities/section.entity";
import { LessonEntity } from "../../../entities/lesson.entity";
import { UserEntity } from "../../../entities/user.entity";

@Injectable()
export class AdminCourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(SectionEntity)
    private sectionRepository: Repository<SectionEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
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
      // not in draft, draft_has_published_course
      qb.andWhere("course.status NOT IN (:...status)", {
        status: [CourseStatus.Draft, CourseStatus.DraftHasPublishedCouse],
      });
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
        "main_category.id",
        "main_category.name",
        // "lessons.id",
        // "lessons.title",
        // "lessons.isCompleted",
      ])
      .leftJoin("course.categories", "categories")
      .leftJoin("course.owner", "owner")
      .leftJoin("course.main_category", "main_category")
      .where("course.status = :status", { status: CourseStatus.Published })
      // .leftJoin("category.lessons", "lessons")
      .andWhere("course.id = :id", { id })
      .andWhere("course.deleted_at IS NULL")
      .orderBy("categories.order", "ASC")
      .addOrderBy("lessons.order", "ASC")
      .getOne();
  }

  async publishCourse(id: number) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ["owner", "sections", "sections.lessons", "categories", "main_category"],
    });

    if (!course)
      throw new CustomHttpException({
        message: "Course not found",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });

    let p: CourseEntity;

    if (course.published_course_id) {
      p = await this.courseRepository.findOne({
        where: { id: course.published_course_id },
      });

      if (!p) {
        throw new CustomHttpException({
          message: "Course not found",
          code: StatusCodesList.NotFound,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      // Update the published course fields with the draft course data
      p.base_price = course.base_price;
      p.categories = course.categories;
      p.description = course.description;
      p.name = course.name;
      p.price = course.price;
      p.requirements = course.requirements;
      p.target_audience = course.target_audience;
      p.thumbnail = course.thumbnail;
      p.feedback_email = course.feedback_email;
      p.objectives = course.objectives;
      p.short_description = course.short_description;
      p.published_at = new Date();
      p.owner = course.owner;
      p.main_category = course.main_category;

      const newCourseSections = await Promise.all(
        course.sections.map(async (section) => {
          const newSection = { ...section };
          delete newSection.id;

          const ls = section.lessons.map((lesson) => {
            const newLesson = { ...lesson };
            newLesson.id = generateId(9);
            newLesson.section_id = newSection.id;
            newLesson.owner_id = p.owner_id;

            return this.lessonRepository.create(newLesson);
          });
          newSection.lessons = ls;

          return this.sectionRepository.create({
            ...newSection,
            course_id: p.id,
            owner_id: p.owner_id,
          });
        }),
      );
      await this.courseRepository.save(p);
      await this.sectionRepository.save(newCourseSections);
    } else {
      // Create a new published course
      const publishedCourse = {
        ...course,
        id: generateId(9),
        status: CourseStatus.Published,
        published_at: new Date(),
        draft_course_id: course.id,
      };

      p = await this.courseRepository.save(publishedCourse);
    }

    // Update the draft course's published_course_id and status
    await this.courseRepository.update(
      {
        id: course.id,
      },
      {
        published_course_id: p.id,
        status: CourseStatus.DraftHasPublishedCouse,
        rejected_reason: null,
      },
    );
  }

  // TODO: Reject note for instructor
  async rejectCourse(id: number, rejected_reason: string, user: UserEntity) {
    const course = await this.courseRepository.findOneOrFail({ where: { id } });
    if (course.status !== CourseStatus.Reviewing) {
      throw new CustomHttpException({
        message: "Không thể từ chối khóa học này",
        code: StatusCodesList.BadRequest,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    await this.courseRepository.update(id, {
      status: CourseStatus.Rejected,
      rejected_reason: {
        reason: rejected_reason,
        rejected_by: user.email,
        rejected_at: new Date(),
      },
    });
  }

  async countCourse() {
    const [allCount, publishedCount, reviewingCount] = await Promise.all([
      this.courseRepository.count({
        where: { status: Not(In([CourseStatus.Draft, CourseStatus.DraftHasPublishedCouse])) },
      }),
      this.courseRepository.count({ where: { status: CourseStatus.Published } }),
      this.courseRepository.count({ where: { status: CourseStatus.Reviewing } }),
      this.courseRepository.count({ where: { status: CourseStatus.Rejected } }),
    ]);

    return {
      all: allCount,
      [CourseStatus.Published]: publishedCount,
      [CourseStatus.Reviewing]: reviewingCount,
      [CourseStatus.Rejected]: reviewingCount,
    };
  }
}
