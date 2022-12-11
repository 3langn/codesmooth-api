import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseEntity } from "../../../entities/course.entity";
import { CreateCourseDto } from "./dto/create-course.dto";

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity)
    private courseRepository: Repository<CourseEntity>,
  ) {}

  async createCourse(data: CreateCourseDto) {
    const course = this.courseRepository.create(data);
    await this.courseRepository.save(course);
    return course;
  }
}
