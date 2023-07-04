import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonEntity } from "../../../entities/lesson.entity";
import { SampleEntity } from "../../../entities/sample.entity";
import { SaveSettingDto, UpdateCategoryDto } from "./setting.dto";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";
import { SettingEntity } from "../../../entities/setting.entity";
import { generateId } from "../../../common/generate-nanoid";

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(SettingEntity)
    private settingRepository: Repository<SettingEntity>,
  ) {}

  async save(data: SaveSettingDto) {
    await this.settingRepository.upsert(
      {
        id: generateId(18),
        ...data,
      },
      {
        conflictPaths: ["key"],
      },
    );
  }

  async listSettings() {
    return await this.settingRepository.find();
  }
}
