import { Body, Controller, Delete, Get, Param, Post, Req } from "@nestjs/common";
import { PageMetaDto } from "../../../common/dto/page-meta.dto";
import { PageDto } from "../../../common/dto/page.dto";
import { ResponseDefault } from "../../../common/dto/response_default";
import { CourseService } from "./course.service";
import { SaveCourseDto } from "./dto/create-course.dto";
import { Auth } from "../../../decorators";

@Controller("admin/course")
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Auth()
  @Post("/")
  async createCourse(@Body() body: SaveCourseDto, @Req() req: any) {
    await this.courseService.saveCourse(body, req.user.id);
    return new ResponseDefault("Course saved successfully");
  }

  @Get("/")
  async getCourses() {
    const res = await this.courseService.getCourses();
    return new PageDto(res, new PageMetaDto({ itemCount: res.length }));
  }

  @Get("/:id")
  async getCourseById(@Param("id") id: number) {
    const data = await this.courseService.getCourseById(id);
    return new ResponseDefault("Success", data);
  }

  @Delete("/:id")
  async deleteCourseById(@Param("id") id: number) {
    await this.courseService.deleteCourseById(id);
    return new ResponseDefault("Course deleted successfully");
  }
}
