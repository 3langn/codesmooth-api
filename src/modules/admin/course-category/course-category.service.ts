import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
import { CourseCategoryEntity } from "../../../entities/course-category.entity";
import { CreateCourseCategoryDto } from "./dto/dto";

@Injectable()
export class CourseCategoryService {
  constructor(
    @InjectRepository(CourseCategoryEntity)
    private courseCategoryRepository: Repository<CourseCategoryEntity>,
  ) {}

  async createCourseCategory(data: CreateCourseCategoryDto) {
    return await this.courseCategoryRepository.upsert(data, {
      conflictPaths: ["id"],
    });
  }

  async updateCourseCategory(title: string, id: number) {
    return await this.courseCategoryRepository.update(id, { title });
  }

  async swapOrder(categoryId1: number, categoryId2: number) {
    const lesson1 = await this.courseCategoryRepository.findOne({
      where: { id: categoryId1 },
    });
    const lesson2 = await this.courseCategoryRepository.findOne({
      where: { id: categoryId2 },
    });

    if (!lesson1 || !lesson2) {
      throw new CustomHttpException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Lesson ${categoryId1} or ${categoryId2} not found`,
        code: StatusCodesList.LessonNotFound,
      });
    }

    const temp = lesson1.order;
    lesson1.order = lesson2.order;
    lesson2.order = temp;

    await this.courseCategoryRepository.save(lesson1);
    await this.courseCategoryRepository.save(lesson2);
  }

  async deleteCourseCategory(id: number) {
    return await this.courseCategoryRepository.delete(id);
  }
}
