import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CategoryEntity } from "../../entities/category.entity";
import { queryPaginationTakeSkip } from "../../common/utils";
import { PageOptionsDto } from "../../common/dto/page-options.dto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async listCategories(pageOptionsDto: PageOptionsDto): Promise<[CategoryEntity[], number]> {
    const qb = this.categoryRepository.createQueryBuilder("category");
    qb.andWhere("category.is_active = true");
    return await queryPaginationTakeSkip({
      query: qb,
      o: pageOptionsDto,
    });
  }
}
