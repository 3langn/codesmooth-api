import { HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, MoreThanOrEqual, Repository } from "typeorm";
import { LessonEntity } from "../../../entities/lesson.entity";
import { SectionEntity } from "../../../entities/section.entity";
import { CreateSectionDto } from "./section.dto";
import { SectionTypeEnum } from "../../../common/enum/course-category-type";
import { InstructorCourseService } from "../course/course.service";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(SectionEntity)
    private sectionRepository: Repository<SectionEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @Inject(forwardRef(() => InstructorCourseService))
    private instructorCourseService: InstructorCourseService,
  ) {}

  async createSection(data: CreateSectionDto, user_id: number) {
    const countLesson = await this.lessonRepository.count({
      where: {
        course: {
          id: data.course_id,
        },
      },
    });
    const lesson = this.lessonRepository.create({
      title: "New Lesson",
      components: [],
      order: countLesson + 1,
      course: {
        id: data.course_id,
      },
      owner: {
        id: user_id,
      },
    });

    const lessonRecord = await this.lessonRepository.save(lesson);

    const section = this.sectionRepository.create({
      course_id: data.course_id,
      order: data.order,
      title: "New Section",
      type: SectionTypeEnum.SECTION,
      owner: {
        id: user_id,
      },
      lessons: [lessonRecord],
    });
    return await this.sectionRepository.save(section);
  }

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
          section_id: true,
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

  async addSection(course_id: number, order: number, user_id: number) {
    const c = await this.instructorCourseService.isCourseOwner(course_id, user_id);
    if (!c) {
      throw new CustomHttpException({
        code: StatusCodesList.NotFound,
        message: "Course not found",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    const section = await this.sectionRepository.findOne({
      where: {
        course_id,
        order,
        owner: {
          id: user_id,
        },
      },
    });

    if (section) {
      await this.sectionRepository.increment(
        { course_id, order: MoreThanOrEqual(order) },
        "order",
        1,
      );
    }

    return await this.createSection({ course_id, order }, user_id);
  }

  async deleteSection(section_id: number, user_id: number) {
    const section = await this.sectionRepository.findOne({
      where: {
        id: section_id,
        owner: {
          id: user_id,
        },
      },
    });

    if (!section) {
      throw new CustomHttpException({
        code: StatusCodesList.NotFound,
        message: "Section not found",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    await this.sectionRepository.delete({
      id: section_id,
      owner: {
        id: user_id,
      },
    });

    await this.sectionRepository.decrement(
      { course_id: section.course_id, order: MoreThan(section.order) },
      "order",
      1,
    );
  }

  async updateSection(section_id: number, title: string, user_id: number) {
    const section = await this.sectionRepository.findOne({
      where: {
        id: section_id,
        owner: {
          id: user_id,
        },
      },
    });

    if (!section) {
      throw new CustomHttpException({
        code: StatusCodesList.NotFound,
        message: "Section not found",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    section.title = title;
    return await this.sectionRepository.save(section);
  }
}
