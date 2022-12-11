import { Body, Controller, Post } from "@nestjs/common";
import { CourseCategoryService } from "./course-category.service";
import { CreateCourseCategoryDto } from "./dto/dto";

@Controller("admin/category")
export class CourseCatController {
  constructor(private courseCatService: CourseCategoryService) {}

  @Post("/")
  async createCatCourse(@Body() body: CreateCourseCategoryDto) {
    return await this.courseCatService.createCourseCategory(body);
  }
}
