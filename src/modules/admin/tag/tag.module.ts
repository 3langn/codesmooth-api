import { Module } from "@nestjs/common";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { PostEntity } from "../../../entities/post.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TagEntity } from "../../../entities/tag.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  controllers: [TagController],
  exports: [TagService],
  providers: [TagService],
})
export class TagModule {}
