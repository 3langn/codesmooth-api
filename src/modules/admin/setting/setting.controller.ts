import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { SaveSettingDto, UpdateCategoryDto } from "./setting.dto";
import { SettingService } from "./setting.service";
import { Auth } from "../../../decorators";
import { UserRole } from "../../../common/enum/user-role";
import { ResponseDefault } from "../../../common/dto/response_default";

@Controller("admin/setting")
export class SettingController {
  constructor(private settingService: SettingService) {}

  @Auth([UserRole.ADMINSTRATOR])
  @Post("/")
  async save(@Body() body: SaveSettingDto) {
    await this.settingService.save(body);

    return new ResponseDefault("Setting saved successfully");
  }

  @Auth([UserRole.ADMINSTRATOR])
  @Get("/")
  async listSettings() {
    return await this.settingService.listSettings();
  }
}
