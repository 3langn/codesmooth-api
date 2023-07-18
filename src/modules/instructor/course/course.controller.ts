import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  ValidationPipe,
} from "@nestjs/common";
import { PageMetaDto } from "../../../common/dto/page-meta.dto";
import { PageDto } from "../../../common/dto/page.dto";
import { ResponseDefault } from "../../../common/dto/response_default";
import { InstructorCourseService } from "./course.service";
import { SaveCourseDto } from "./dto/create-course.dto";
import { Auth } from "../../../decorators";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { InstructorCourseReponseDto } from "./dto/course-response.dto";
import { InstructorGetCoursePageOptionsDto } from "./dto";
@Controller("instructor/course")
export class InstructorCourseController {
  constructor(private courseService: InstructorCourseService) {}

  @Auth()
  @Post("/")
  async createCourse(@Body() body: SaveCourseDto, @Req() req: any) {
    await this.courseService.createCourse(body, req.user.id);
    return new ResponseDefault("Course saved successfully");
  }

  @Auth()
  @Put("/:id")
  async updateCourse(@Param("id") id: number, @Body() body: SaveCourseDto, @Req() req: any) {
    await this.courseService.updateCourse(id, body, req.user.id);
    return new ResponseDefault("Course updated successfully");
  }

  @Auth()
  @Get("/")
  async getCourses(
    @Query()
    pageOptionsDto: InstructorGetCoursePageOptionsDto,
    @Req() req: any,
  ) {
    const [courses, total] = await this.courseService.getCourses(pageOptionsDto, req.user.id);
    return new PageDto<InstructorCourseReponseDto>(
      courses,
      new PageMetaDto({
        itemCount: total,
        pageOptionsDto,
      }),
    );
  }

  @Auth()
  @Get("/count-course")
  async countCourse(@Req() req: any) {
    const count = await this.courseService.countCourse(req.user.id);
    return new ResponseDefault("Success", count);
  }

  @Auth()
  @Get("/:id")
  async getCourseById(@Param("id") id: number, @Req() req: any) {
    const data = await this.courseService.getCourseById(id, req.user.id);
    return new ResponseDefault("Success", data);
  }

  @Auth()
  @Delete("/:id")
  async deleteCourseById(@Param("id") id: number, @Req() req: any) {
    await this.courseService.deleteCourseById(id, req.user.id);
    return new ResponseDefault("Course deleted successfully");
  }

  @Auth()
  @Patch("/submit-for-review/:id")
  async submitCourseForReview(@Param("id") id: number, @Req() req: any) {
    await this.courseService.submitCourseForReview(id, req.user.id);
    return new ResponseDefault("Course submitted successfully");
  }
}
