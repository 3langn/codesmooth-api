import { Module } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostEntity } from "../../entities/post.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "../../entities/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity, TagEntity])],
  controllers: [PostController],
  exports: [PostService],
  providers: [PostService],
})
export class PostModule {}
