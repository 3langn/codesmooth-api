import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { CourseService } from "./course.service";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { PageDto } from "../../common/dto/page.dto";
import { Auth } from "../../decorators";
import { ResponseDefault } from "../../common/dto/response_default";

@Controller("course")
export class CourseController {
  constructor(private courseService: CourseService) {}

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
  @Get("/:id")
  async getCourseById(@Param("id") id: number, @Req() req: any) {
    const data = await this.courseService.getCourseById(id, req.user.id);
    return new ResponseDefault("Success", data);
  }
}