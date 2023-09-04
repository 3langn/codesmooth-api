import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostEntity } from "../../entities/post.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "../../entities/tag.entity";
import { SeriesEntity } from "../../entities/series.entity";
import { SeriesService } from "./series.service";

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, TagEntity, SeriesEntity])],
  controllers: [PostController],
  exports: [PostService, SeriesService],
  providers: [PostService, SeriesService],
})
export class PostModule {}
