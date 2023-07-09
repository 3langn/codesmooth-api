import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from "@nestjs/common";
import { AdminCourseService as AdminCourseService } from "./course.service";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { ListCourseQueryDto } from "./dto/list-course.dto";
import { PageDto } from "../../../common/dto/page.dto";
import { PageMetaDto } from "../../../common/dto/page-meta.dto";
import { Auth } from "../../../decorators";
import { UserRole } from "../../../common/enum/user-role";
import { ResponseDefault } from "../../../common/dto/response_default";

@Controller("admin/course")
export class AdminCourseController {
  constructor(private courseService: AdminCourseService) {}

  @Auth([UserRole.ADMINSTRATOR])
  @Get("/")
  async getCourses(@Query() pageOptionsDto: ListCourseQueryDto) {
    const [courses, total] = await this.courseService.getCourses(pageOptionsDto);
    return new PageDto<any>(
      courses,
      new PageMetaDto({
        itemCount: total,
        pageOptionsDto,
      }),
    );
  }

  @Auth([UserRole.ADMINSTRATOR])
  @Get("/count-course")
  async countCourse() {
    const count = await this.courseService.countCourse();
    return new ResponseDefault("Success", count);
  }

  @Auth([UserRole.ADMINSTRATOR])
  @Patch("/publish/:id")
  async publishCourse(@Param("id") id: number) {
    await this.courseService.publishCourse(id);
    return new ResponseDefault("Success");
  }

  @Auth([UserRole.ADMINSTRATOR])
  @Patch("/rejected/:id")
  async rejected(@Param("id") id: number) {
    await this.courseService.rejectCourse(id);
    return new ResponseDefault("Success");
  }
}
