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

  async checkPermission(lesson_id: number, user_id: number, loadCompletedUsers = false) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lesson_id },
      relations: {
        completedUsers: loadCompletedUsers,
      },
    });

    if (!lesson) {
      throw new CustomHttpException({
        code: StatusCodesList.LessonNotFound,
        message: `Lesson ${lesson_id} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const c = await this.courseRepository.findOne({
      where: [
        { id: lesson.course_id, students: { id: user_id } },
        {
          id: lesson.course_id,
          owner: { id: user_id },
        },
      ],
    });

    if (!c) {
      throw new CustomHttpException({
        statusCode: HttpStatus.FORBIDDEN,
        message: `Không có quyền truy cập`,
        code: StatusCodesList.Forbidden,
      });
    }

    return { lesson, course: c };
  }

  async markLessonAsCompleted(lesson_id: number, isCompleted: boolean, user: UserEntity) {
    const { lesson, course } = await this.checkPermission(lesson_id, user.id, true);

    if (!lesson.completedUsers) {
      lesson.completedUsers = [];
    }
    if (isCompleted) {
      lesson.completedUsers.push(user);
    } else {
      lesson.completedUsers = lesson.completedUsers.filter((u) => u.id !== user.id);
    }
    await this.lessonRepository.save(lesson);
  }

  async getLesson(lesson_id: number, user_id: number) {
    const { lesson, course } = await this.checkPermission(lesson_id, user_id);

    // check user has completed this lesson
    const count = await this.datasource.query(
      `SELECT COUNT(*) FROM userscompleted_lessons WHERE lesson_id = ${lesson_id} AND user_id = ${user_id}`,
    );
    delete lesson.completedUsers;

    return {
      ...lesson,
      is_completed: count[0].count > 0,
    };
  }

  async getLessonsBySectionId(section_id: number, userId: number) {
    const lessons = await this.lessonRepository.find({
      select: ["id", "title", "order", "section_id"],
      where: { section: { id: section_id }, owner: { id: userId } },
      order: { order: "ASC" },
    });
    return lessons;
  }
}
