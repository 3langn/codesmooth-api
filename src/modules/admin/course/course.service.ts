import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ResponseDefault } from "../../../common/dto/response_default";
import { CourseEntity } from "../../../entities/course.entity";
import { SaveCourseDto } from "./dto/create-course.dto";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>
  ) {}

  async saveCourse(data: SaveCourseDto) {
    await this.courseRepository.upsert(data, { conflictPaths: ["id"] });
  }

  async getCourses() {
    return await this.courseRepository.find();
  }

  async getCourseById(id: number) {
    // select id, title from lessons
    return await this.courseRepository
      .createQueryBuilder("course")
      .select([
        "course",
        "category.id",
        "category.title",
        "lessons.id",
        "lessons.title",
      ])
      .leftJoin("course.category", "category")
      .leftJoin("category.lessons", "lessons")
      .where("course.id = :id", { id })
      .getOne();
  }

  async deleteCourseById(id: number) {
    await this.courseRepository.delete(id);
  }
}
