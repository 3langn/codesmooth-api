import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";
import { CategoryService } from "./category.service";
import { Auth } from "../../../decorators";
import { UserRole } from "../../../common/enum/user-role";

@Controller("admin/category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Auth([UserRole.ADMINSTRATOR])
  @Post("/")
  async create(@Body() body: CreateCategoryDto) {
    return await this.categoryService.create(body);
  }

  @Auth([UserRole.ADMINSTRATOR])
  @Get("/")
  async listCategories() {
    return await this.categoryService.listCategories();
  }

  @Auth([UserRole.ADMINSTRATOR])
  @Put("/:id")
  async updateCategory(@Param("id") id: number, @Body() body: UpdateCategoryDto) {
    return await this.categoryService.updateCategory(id, body);
  }
}
