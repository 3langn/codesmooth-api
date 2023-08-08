import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, MoreThanOrEqual, Repository } from "typeorm";
import { LessonEntity } from "../../entities/lesson.entity";
import { SectionEntity } from "../../entities/section.entity";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { CourseEntity } from "../../entities/course.entity";
@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @InjectRepository(SectionEntity)
    private sectionRepository: Repository<SectionEntity>,
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
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

  async markLessonAsCompleted(lesson_id: number, isCompleted: boolean) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lesson_id },
    });

    if (!lesson) {
      throw new CustomHttpException({
        code: StatusCodesList.LessonNotFound,
        message: `Lesson ${lesson_id} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    lesson.isCompleted = isCompleted;
    return await this.lessonRepository.save(lesson);
  }

  async getLesson(lesson_id: number, user_id: number) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lesson_id },
    });
    if (!lesson) {
      throw new CustomHttpException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Lesson ${lesson_id} not found`,
        code: StatusCodesList.LessonNotFound,
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

    return lesson;
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
