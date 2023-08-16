import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SettingEntity } from "../../../entities/setting.entity";
import { CustomHttpException } from "../../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../../common/constants/status-codes-list.constants";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingEntity)
    private readonly settingsRepository: Repository<SettingEntity>,
  ) {}

  async getSettings(key: string) {
    return await this.settingsRepository.findOne({ where: { key } });
  }

  async getDiscountSettings(): Promise<number> {
    const r = await this.settingsRepository.findOne({ where: { key: "discount" } });

    if (!r) {
      throw new CustomHttpException({
        message: "Có lỗi xảy ra",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: StatusCodesList.DiscountNotFound,
        error: new Error("Không tìm thấy cài đặt chiết khấu"),
      });
    }

    return r.values[0];
  }
}
