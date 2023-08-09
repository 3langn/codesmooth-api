import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, In, MoreThanOrEqual, Repository } from "typeorm";
import { LessonEntity } from "../../entities/lesson.entity";
import { SectionEntity } from "../../entities/section.entity";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { CourseEntity } from "../../entities/course.entity";
import { UserEntity } from "../../entities/user.entity";
@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @InjectRepository(SectionEntity)
    private sectionRepository: Repository<SectionEntity>,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
    @InjectDataSource() private readonly datasource: DataSource,
  ) {}

  async findOneLessonOrFail(lesson_id: number, user_id: number) {
    const lessonExist = await this.lessonRepository.findOne({
      where: { id: lesson_id, owner: { id: user_id } },
      relations: ["section"],
    });
    if (!lessonExist) {
      throw new CustomHttpException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Lesson ${lesson_id} not found`,
        code: StatusCodesList.LessonNotFound,
      });
    }
    return lessonExist;
  }

  // async checkPermission(lesson_id: number, user_id: number, loadCompletedUsers = false) {
  //   const lesson = await this.lessonRepository.findOne({
  //     where: { id: lesson_id },
  //     relations: {
  //       completed_users: loadCompletedUsers,
  //     },
  //   });

  //   if (!lesson) {
  //     throw new CustomHttpException({
  //       code: StatusCodesList.LessonNotFound,
  //       message: `Lesson ${lesson_id} not found`,
  //       statusCode: HttpStatus.NOT_FOUND,
  //     });
  //   }

  //   const c = await this.courseRepository.findOne({
  //     where: [
  //       { id: lesson.course_id, students: { id: user_id } },
  //       {
  //         id: lesson.course_id,
  //         owner: { id: user_id },
  //       },
  //     ],
  //   });

  //   if (!c) {
  //     throw new CustomHttpException({
  //       statusCode: HttpStatus.FORBIDDEN,
  //       message: `Không có quyền truy cập`,
  //       code: StatusCodesList.Forbidden,
  //     });
  //   }

  //   return { lesson, course: c };
  // }

  async checkPermission(course_id: number, user_id: number, loadCompletedUsers = false) {
    const c = await this.courseRepository.count({
      where: { id: course_id, students: { id: user_id } },
    });

    if (c === 0) {
      throw new CustomHttpException({
        statusCode: HttpStatus.FORBIDDEN,
        message: `Không có quyền truy cập`,
        code: StatusCodesList.Forbidden,
      });
    }
  }

  async markLessonAsCompleted(
    lesson_id: number,
    course_id: number,
    isCompleted: boolean,
    user: UserEntity,
  ) {
    await this.checkPermission(course_id, user.id);

    if (isCompleted) {
      await this.datasource.getRepository("userscompleted_lessons").insert({
        lesson_id,
        user_id: user.id,
      });
    } else {
      await this.datasource.getRepository("userscompleted_lessons").delete({
        lesson_id,
        user_id: user.id,
      });
    }
  }

  async getLesson(lesson_id: number, course_id: number, user_id: number) {
    await this.checkPermission(course_id, user_id);

    // check user has completed this lesson
    const count = await this.datasource.createEntityManager().count("userscompleted_lessons", {
      where: {
        lesson_id: lesson_id,
        user_id: user_id,
      },
    });

    const lesson = await this.lessonRepository.findOne({
      where: { id: lesson_id },
      relations: {
        completed_users: true,
      },
    });

    const countLesson = await this.lessonRepository.count({
      where: {
        course_id: lesson.course_id,
      },
    });
    delete lesson.completed_users;

    return {
      ...lesson,
      is_completed: count > 0,
      is_first: lesson.order === 1,
      is_last: lesson.order === countLesson,
    };
  }

  async getLessonsBySectionId(section_id: number, userId: number) {
    const lessons = await this.lessonRepository
      .createQueryBuilder("lesson")
      .select([
        "lesson.id",
        "lesson.title",
        "lesson.order",
        "lesson.section_id",
        "lesson.course_id",
      ])
      .where("lesson.section_id = :section_id", { section_id })
      .loadRelationCountAndMap(
        "lesson.completed_count",
        "lesson.completed_users",
        "completed_users",
        (qb) => qb.where("completed_users.id = :userId", { userId }),
      )
      .orderBy("lesson.order", "ASC")
      .getMany();
    return lessons;
  }
}
