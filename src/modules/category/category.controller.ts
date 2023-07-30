import { Body, Controller, Get, Param, Post, Put, Query, ValidationPipe } from "@nestjs/common";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";
import { CategoryService } from "./category.service";
import { Auth } from "../../decorators";
import { UserRole } from "../../common/enum/user-role";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { PageDto } from "../../common/dto/page.dto";

@Controller("category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get("/")
  async listCategories(
    @Query()
    pageOptionsDto: PageOptionsDto,
  ) {
    const [cats, itemCount] = await this.categoryService.listCategories(pageOptionsDto);
    return new PageDto<any>(
      cats,
      new PageMetaDto({
        itemCount: itemCount,
        pageOptionsDto,
      }),
    );
  }
}
