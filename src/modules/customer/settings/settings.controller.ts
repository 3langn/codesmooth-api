import { Controller, Get, Param, Query } from "@nestjs/common";
import { SettingsService } from "./settings.service";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get("/:key")
  async getSettings(@Param("key") key: any) {
    return await this.settingsService.getSettings(key);
  }
}
