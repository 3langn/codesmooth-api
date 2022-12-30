import { Body, Controller, Param, Patch, Post } from "@nestjs/common";
import { CourseCategoryService } from "./course-category.service";
import { CreateCourseCategoryDto, UpdateCourseCategoryDto } from "./dto/dto";

@Controller("admin/category")
export class CourseCatController {
  constructor(private courseCatService: CourseCategoryService) {}

  @Post("/")
  async createCatCourse(@Body() body: CreateCourseCategoryDto) {
    return await this.courseCatService.createCourseCategory(body);
  }

  @Patch("/:id")
  async updateCatCourse(
    @Body() body: UpdateCourseCategoryDto,
    @Param("id") id: number
  ) {
    return await this.courseCatService.updateCourseCategory(body.title, id);
  }
}
