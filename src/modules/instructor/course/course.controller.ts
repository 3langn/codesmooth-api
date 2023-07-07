import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from "@nestjs/common";
import { PageMetaDto } from "../../../common/dto/page-meta.dto";
import { PageDto } from "../../../common/dto/page.dto";
import { ResponseDefault } from "../../../common/dto/response_default";
import { InstructorCourseService } from "./course.service";
import { SaveCourseDto } from "./dto/create-course.dto";
import { Auth } from "../../../decorators";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { InstructorCourseReponseDto } from "./dto/course-response.dto";

@Controller("instructor/course")
export class InstructorCourseController {
  constructor(private courseService: InstructorCourseService) {}

  @Auth()
  @Post("/")
  async createCourse(@Body() body: SaveCourseDto, @Req() req: any) {
    await this.courseService.saveCourse(body, req.user.id);
    return new ResponseDefault("Course saved successfully");
  }

  @Auth()
  @Put("/:id")
  async updateCourse(@Param("id") id: number, @Body() body: SaveCourseDto) {
    await this.courseService.updateCourse(id, body);
    return new ResponseDefault("Course updated successfully");
  }

  @Auth()
  @Get("/")
  async getCourses(@Query() pageOptionsDto: PageOptionsDto) {
    const [courses, total] = await this.courseService.getCourses(pageOptionsDto);
    return new PageDto<InstructorCourseReponseDto>(
      courses,
      new PageMetaDto({
        itemCount: total,
        pageOptionsDto,
      }),
    );
  }

  @Auth()
  @Get("/:id")
  async getCourseById(@Param("id") id: number, @Req() req: any) {
    const data = await this.courseService.getCourseById(id, req.user.id);
    return new ResponseDefault("Success", data);
  }

  @Auth()
  @Delete("/:id")
  async deleteCourseById(@Param("id") id: number) {
    await this.courseService.deleteCourseById(id);
    return new ResponseDefault("Course deleted successfully");
  }

  @Auth()
  @Patch("/submit-for-review/:id")
  async submitCourseForReview(@Param("id") id: number) {
    await this.courseService.submitCourseForReview(id);
    return new ResponseDefault("Course submitted successfully");
  }
}
