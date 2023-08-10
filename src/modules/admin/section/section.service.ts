import { InjectRepository } from "@nestjs/typeorm";
import { SectionEntity } from "../../../entities/section.entity";
import { LessonEntity } from "../../../entities/lesson.entity";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(SectionEntity)
    private sectionRepository: Repository<SectionEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
  ) {}

  async getSections(course_id: number, user_id: number) {
    return await this.sectionRepository.find({
      select: {
        id: true,
        course_id: true,
        order: true,
        title: true,
        type: true,
        lessons: {
          id: true,
          order: true,
          title: true,
        },
      },
      where: {
        course_id,
        owner: {
          id: user_id,
        },
      },
      relations: ["lessons"],
      order: { order: "ASC" },
    });
  }

  async getSectionsWithLesson(course_id: number) {
    return await this.sectionRepository
      .createQueryBuilder("section")
      .select([
        "section.id",
        "section.course_id",
        "section.order",
        "section.title",
        "section.type",
        "lesson.id",
        "lesson.order",
        "lesson.title",
        "lesson.section_id",
      ])
      .where("section.course_id = :course_id", { course_id })
      .leftJoin("section.lessons", "lesson")
      .orderBy("section.order", "ASC")
      .orderBy("lesson.order", "ASC")
      .getMany();
  }
}
