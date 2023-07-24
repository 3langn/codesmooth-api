import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SettingEntity } from "../../entities/setting.entity";
import { Repository } from "typeorm";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingsRepository: Repository<SettingEntity>,
  ) {}

  async getSettings(key: string) {
    return await this.settingsRepository.findOne({ where: { key } });
  }
}
