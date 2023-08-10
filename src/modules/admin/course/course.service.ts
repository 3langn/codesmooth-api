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

  async getCourseById(id: number) {
    console.log("id", id);

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
      .andWhere("course.id = :id", { id })
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
        relations: ["owner", "sections", "sections.lessons"],
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

      p = await this.courseRepository.save(p);
    } else {
      // Create a new published course

      const publishedCourse = {
        ...course,
        sections: [],
        id: generateId(9),
        status: CourseStatus.Published,
        published_at: new Date(),
        draft_course_id: course.id,
      };

      p = await this.courseRepository.save(publishedCourse);
    }

    await this.saveSectionForPublishCourse(course, p);
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

  private async saveSectionForPublishCourse(
    courseDraft: CourseEntity,
    coursePublish: CourseEntity,
  ) {
    const plMap = {};
    const psMap = {};

    coursePublish.sections.forEach((section) => {
      psMap[section.parent_id] = section;
      section.lessons.forEach((lesson) => {
        plMap[lesson.parent_id] = lesson;
      });
    });

    const newCourseSections = await Promise.all(
      courseDraft.sections.map(async (section) => {
        const newSection = { ...section };
        if (psMap[section.id]) {
          newSection.id = psMap[section.id].id;
        } else {
          delete newSection.id;
        }
        newSection.parent_id = section.id;
        newSection.course_id = coursePublish.id;

        const ls = section.lessons.map((lesson) => {
          const newLesson = { ...lesson };

          // nếu khóa học đã được publish rồi thì sẽ sử dụng lại id của lesson cũ tránh mất thông tin
          if (plMap[lesson.id]) {
            newLesson.id = plMap[lesson.id].id;
          } else {
            delete newLesson.id;
          }
          newLesson.parent_id = lesson.id;
          newLesson.course_id = coursePublish.id;

          newLesson.section_id = newSection.id;
          return this.lessonRepository.create(newLesson);
        });
        newSection.lessons = ls;

        return this.sectionRepository.create({
          ...newSection,
          course_id: coursePublish.id,
          owner_id: coursePublish.owner_id,
        });
      }),
    );
    await this.sectionRepository.save(newCourseSections);
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
