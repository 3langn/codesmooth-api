import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { CourseService } from "./course.service";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { PageDto } from "../../../common/dto/page.dto";
import { PageMetaDto } from "../../../common/dto/page-meta.dto";
import { Auth } from "../../../decorators";
import { ResponseDefault } from "../../../common/dto/response_default";
import { ReviewService } from "../../review/review.service";
import { ReviewCourseRequest } from "../../review/review.dto";

@Controller("course")
export class CourseController {
  constructor(private courseService: CourseService, private reviewService: ReviewService) {}

  @Get("/")
  async getCourses(@Query() pageOptionsDto: PageOptionsDto) {
    const [courses, total] = await this.courseService.getCourses(pageOptionsDto);
    return new PageDto<any>(
      courses,
      new PageMetaDto({
        itemCount: total,
        pageOptionsDto,
      }),
    );
  }

  @Auth()
  @Get("/my-course")
  async getMyCourses(@Query() pageOptionsDto: PageOptionsDto, @Req() req: any) {
    const [courses, total] = await this.courseService.getMyCourses(pageOptionsDto, req.user?.id);
    return new PageDto<any>(
      courses,
      new PageMetaDto({
        itemCount: total,
        pageOptionsDto,
      }),
    );
  }

  @Auth([], { public: true })
  @Get("/:id")
  async getCourseById(@Param("id") id: number, @Req() req: any) {
    const data = await this.courseService.getCourseById(id, req.user?.id);
    return new ResponseDefault("Success", data);
  }
}
