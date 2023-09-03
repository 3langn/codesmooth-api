import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTagRequest } from "./tag.dto";
import { TagEntity } from "../../../entities/tag.entity";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { queryPagination } from "../../../common/utils";

@Injectable()
export class TagService {
  constructor(@InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>) {}

  async createTag(req: CreateTagRequest) {
    const tag = this.tagRepo.create(req);
    return await this.tagRepo.save(tag);
  }

  async getTags(req: PageOptionsDto) {
    const qb = this.tagRepo.createQueryBuilder("tag");

    return queryPagination({
      query: qb,
      o: req,
    });
  }
}
