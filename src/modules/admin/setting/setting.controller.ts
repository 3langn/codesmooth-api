import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { SaveSettingDto, UpdateCategoryDto } from "./setting.dto";
import { AdminSettingsService } from "./setting.service";
import { Auth } from "../../../decorators";
import { UserRole } from "../../../common/enum/user-role";
import { ResponseDefault } from "../../../common/dto/response_default";

@Controller("admin/setting")
export class AdminSettingsController {
  constructor(private settingService: AdminSettingsService) {}

  @Auth([UserRole.ADMINSTRATOR])
  @Post("/")
  async save(@Body() body: SaveSettingDto) {
    await this.settingService.save(body);

    return new ResponseDefault("Setting saved successfully");
  }

  // TODO: Uncomment this line
  @Auth([UserRole.ADMINSTRATOR])
  @Get("/")
  async listSettings() {
    const r = await this.settingService.listSettings();

    return new ResponseDefault("List settings successfully", r);
  }

  @Auth([UserRole.ADMINSTRATOR])
  @Get("/:key")
  async getSetting(@Param("key") key: string) {
    const r = await this.settingService.getSetting(key);

    return new ResponseDefault("Get setting successfully", r);
  }
}
