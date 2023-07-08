import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonEntity } from "../../../entities/lesson.entity";
import { SampleEntity } from "../../../entities/sample.entity";
import { CreateCategoryDto, UpdateCategoryDto } from "./category.dto";
import { CategoryEntity } from "../../../entities/category.entity";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";
import { queryPagination } from "../../../common/utils";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(data: CreateCategoryDto) {
    const isExist = await this.categoryRepository.findOne({
      where: [{ name: data.name }, { order: data.order }],
    });
    if (isExist) {
      throw new CustomHttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category name or order already exists",
        code: StatusCodesList.CategoryExists,
      });
    }
    const c = this.categoryRepository.create({
      ...data,
    });
    return await this.categoryRepository.save(c);
  }

  async listCategories(pageOptionsDto: PageOptionsDto): Promise<[CategoryEntity[], number]> {
    const qb = this.categoryRepository.createQueryBuilder("category");
    return await queryPagination({
      query: qb,
      o: pageOptionsDto,
    });
  }

  async updateCategory(id: number, data: UpdateCategoryDto) {
    const c = await this.categoryRepository.findOne({ where: { id } });
    if (!c) {
      throw new CustomHttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Category not found",
        code: StatusCodesList.CategoryNotFound,
      });
    }
    return await this.categoryRepository.save({
      ...c,
      ...data,
    });
  }
}
