import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonEntity } from "../../../entities/lesson.entity";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";
@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
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

  async getLesson(lesson_id: number) {
    const lesson = await this.lessonRepository.findOne({
      where: { id: lesson_id },
    });

    const countLesson = await this.lessonRepository.count({
      where: {
        course_id: lesson.course_id,
      },
    });

    return {
      ...lesson,
      is_first: lesson.order === 1,
      is_last: lesson.order === countLesson,
    };
  }

  async getLessonsBySectionId(section_id: number) {
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
      .orderBy("lesson.order", "ASC")
      .getMany();
    return lessons;
  }
}
