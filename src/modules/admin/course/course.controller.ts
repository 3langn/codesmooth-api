import { Body, Controller, Get, Post } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";

@Controller("admin/course")
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post("/")
  async createCourse(@Body() body: CreateCourseDto) {
    return await this.courseService.createCourse(body);
  }
}
