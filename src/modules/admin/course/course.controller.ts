import { Body, Controller, Get, Post } from "@nestjs/common";
import { PageMetaDto } from "../../../common/dto/page-meta.dto";
import { PageDto } from "../../../common/dto/page.dto";
import { CourseService } from "./course.service";
import { CreateCourseDto } from "./dto/create-course.dto";

@Controller("admin/course")
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Post("/")
  async createCourse(@Body() body: CreateCourseDto) {
    return await this.courseService.createCourse(body);
  }

  @Get("/")
  async getCourses() {
    const res = await this.courseService.getCourses();
    return new PageDto(res, new PageMetaDto({ itemCount: res.length }));
  }
}
