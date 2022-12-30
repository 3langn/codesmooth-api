import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonEntity } from "../../../entities/lesson.entity";
import { CreateLessonDto } from "./lesson.dto";
import { NotFoundException } from "src/common/exception/not-found.exception";
import { ExceptionTitleList } from "src/common/constants/exception-title-list.constants";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>
  ) {}

  async createLesson(data: CreateLessonDto) {
    console.log(data);

    return await this.lessonRepository.upsert(data, { conflictPaths: ["id"] });
  }

  async getLessons(lesson_id: number) {
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
    return lesson;
  }
}
