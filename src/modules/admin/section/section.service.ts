import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
import { SectionEntity } from "../../../entities/section";
import { CreateSectionDto } from "./dto/dto";

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(SectionEntity)
    private sectionRepository: Repository<SectionEntity>,
  ) {}

  async createSection(data: CreateSectionDto) {
    await this.sectionRepository.update(
      {
        order: MoreThanOrEqual(data.order),
        course_id: data.courseId,
      },
      {
        order: () => '"order" + 1',
      },
    );

    const section = await this.sectionRepository.save(data);
    return section;
  }

  async updateSection(title: string, id: number) {
    return await this.sectionRepository.update(id, { title });
  }

  async swapOrder(categoryId1: number, categoryId2: number) {
    const lesson1 = await this.sectionRepository.findOne({
      where: { id: categoryId1 },
    });
    const lesson2 = await this.sectionRepository.findOne({
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

    await this.sectionRepository.save(lesson1);
    await this.sectionRepository.save(lesson2);
  }

  async deleteSection(id: number) {
    const cat = await this.sectionRepository.findOneOrFail({
      where: { id },
    });
    await this.sectionRepository.update(
      {
        order: MoreThanOrEqual(cat.order),
        course_id: cat.course_id,
      },
      {
        order: () => '"order" + 1',
      },
    );
    return await this.sectionRepository.delete(id);
  }
}
