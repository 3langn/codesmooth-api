import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseEntity } from "../../../entities/course.entity";
import { CreateCourseDto } from "./dto/create-course.dto";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>
  ) {}

  async createCourse(data: CreateCourseDto) {
    await this.courseRepository.upsert(data, { conflictPaths: ["id"] });
    // const course = this.courseRepository.create(data);
  }

  async getCourses() {
    return await this.courseRepository.find();
  }

  async getCourseById(id: number) {
    return await this.courseRepository.findOne({ where: { id } });
  }
}
