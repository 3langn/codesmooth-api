import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryEntity } from "../../entities/category.entity";
import { queryPagination } from "../../common/utils";
import { PageOptionsDto } from "../../common/dto/page-options.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async listCategories(pageOptionsDto: PageOptionsDto): Promise<[CategoryEntity[], number]> {
    const qb = this.categoryRepository.createQueryBuilder("category");
    qb.where("category.deleted_at IS NULL").andWhere("category.is_active = true");
    return await queryPagination({
      query: qb,
      o: pageOptionsDto,
    });
  }
}
