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
export class AdminSettingsService {
  constructor(
    @InjectRepository(SettingEntity)
    private settingRepository: Repository<SettingEntity>,
  ) {}

  async save(data: SaveSettingDto) {
    await this.settingRepository.upsert(
      {
        id: generateId(9),
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

  async getSetting(key: string) {
    const setting = await this.settingRepository.findOne({ where: { key } });

    if (!setting) {
      throw new CustomHttpException({
        code: StatusCodesList.NotFound,
        message: "Không tìm thấy setting '" + key + "'",
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return setting;
  }
}
