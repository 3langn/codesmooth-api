import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonEntity } from "../../../entities/lesson.entity";
import { SampleEntity } from "../../../entities/sample.entity";
import { CreateSampleDto } from "./sample.dto";

@Injectable()
export class SampleService {
  constructor(
    @InjectRepository(SampleEntity)
    private sampleRepository: Repository<SampleEntity>
  ) {}

  async createSample(data: CreateSampleDto) {
    const lesson = this.sampleRepository.create({
      content: data.sample.content,
      id: data.language,
      type: data.sample.type,
    });
    return await this.sampleRepository.save(lesson);
  }

  async getSample(language: string) {
    return await this.sampleRepository.findOne({ where: { id: language } });
  }
}
