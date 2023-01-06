import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { ResponseDefault } from "../../../common/dto/response_default";
import { CourseCategoryService } from "./course-category.service";
import { CreateCourseCategoryDto, SwapOrderRequestDto, UpdateCourseCategoryDto } from "./dto/dto";

@Controller("admin/category")
export class CourseCatController {
  constructor(private courseCatService: CourseCategoryService) {}

  @Post("/")
  async createCatCourse(@Body() body: CreateCourseCategoryDto) {
    return await this.courseCatService.createCourseCategory(body);
  }

  @Patch("/:id")
  async updateCatCourse(@Body() body: UpdateCourseCategoryDto, @Param("id") id: number) {
    return await this.courseCatService.updateCourseCategory(body.title, id);
  }

  @Post("/swap-order")
  async swapOrder(@Body() req: SwapOrderRequestDto) {
    const res = await this.courseCatService.swapOrder(req.categoryId1, req.categoryId2);
    return new ResponseDefault("Order swapped successfully", res);
  }

  @Delete("/:id")
  async deleteCatCourse(@Param("id") id: number) {
    return await this.courseCatService.deleteCourseCategory(id);
  }
}
