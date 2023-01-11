import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, MoreThanOrEqual, Repository } from "typeorm";
import { LessonEntity } from "../../../entities/lesson.entity";
import { SaveLessonDto, UpdateLessonsOrder } from "./lesson.dto";
import { NotFoundException } from "src/common/exception/not-found.exception";
import { ExceptionTitleList } from "src/common/constants/exception-title-list.constants";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
  ) {}

  async saveLesson(data: SaveLessonDto) {
    await this.lessonRepository.save(data);
  }

  async addLesson(data: SaveLessonDto) {
    await this.lessonRepository.update(
      {
        order: MoreThanOrEqual(data.order),
        course_category_id: data.course_category_id,
      },
      {
        order: () => '"order" + 1',
      },
    );

    const lesson = await this.lessonRepository.save(data);
    return lesson;
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

  async swapOrder(lesson1_id: number, lesson2_id: number) {
    const lesson1 = await this.lessonRepository.findOne({
      where: { id: lesson1_id },
    });
    const lesson2 = await this.lessonRepository.findOne({
      where: { id: lesson2_id },
    });

    if (!lesson1 || !lesson2) {
      throw new CustomHttpException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Lesson ${lesson1_id} or ${lesson2_id} not found`,
        code: StatusCodesList.LessonNotFound,
      });
    }

    const temp = lesson1.order;
    lesson1.order = lesson2.order;
    lesson2.order = temp;

    await this.lessonRepository.save(lesson1);
    await this.lessonRepository.save(lesson2);
  }

  async deleteLessonById(lesson_id: number) {
    const lesson = await this.lessonRepository.findOneOrFail({
      where: { id: lesson_id },
    });
    await this.lessonRepository.update(
      {
        order: MoreThanOrEqual(lesson.order),
      },
      {
        order: () => '"order" - 1',
      },
    );
    await this.lessonRepository.delete(lesson_id);
  }
}
