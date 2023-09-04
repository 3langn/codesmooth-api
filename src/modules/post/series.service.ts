import { Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { SeriesEntity } from "../../entities/series.entity";
import { DataSource, In, Repository } from "typeorm";
import { CreateOrUpdateSeriesRequest } from "./series.dto";
import { PostService } from "./post.service";
import { PostEntity } from "../../entities/post.entity";

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(SeriesEntity) private seriesRepo: Repository<SeriesEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async findSeriesById(id: number, user_id: number) {
    const series = await this.seriesRepo.findOne({
      select: {
        id: true,
        name: true,
        author_id: true,
        posts: {
          id: true,
          title: true,
          slug: true,
        },
      },
      where: { id, author_id: user_id },
      relations: ["posts"],
    });
    return series;
  }

  async createOrUpdateSeries(req: CreateOrUpdateSeriesRequest, user_id: number) {
    await this.dataSource.transaction(async (manager) => {
      const series = this.seriesRepo.create({
        ...req,
        author_id: user_id,
      });

      const r = await manager.save(series);
      await manager.update(PostEntity, { id: In(req.post_ids) }, { series_id: r.id });
    });
  }

  async getMySeries(user_id: number) {
    return await this.seriesRepo.find({
      where: { author_id: user_id },
    });
  }

  async getSeriesById(id: number) {
    return await this.seriesRepo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        author_id: true,
        posts: {
          id: true,
          title: true,
          slug: true,
        },
      },
      relations: ["posts"],
      order: {
        posts: {
          series_order: "ASC",
        },
      },
    });
  }

  async deleteSeries(id: number, user_id: number) {
    await this.seriesRepo.delete({
      id,
      author_id: user_id,
    });
  }
}
