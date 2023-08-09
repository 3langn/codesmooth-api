import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SectionController } from "./section.controller";
import { SectionService } from "./section.service";
import { SectionEntity } from "../../entities/section.entity";
import { LessonEntity } from "../../entities/lesson.entity";

@Module({
  imports: [TypeOrmModule.forFeature([SectionEntity, LessonEntity])],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionModule {}
