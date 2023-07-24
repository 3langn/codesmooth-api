import { Module } from "@nestjs/common";
import { SettingEntity } from "../../entities/setting.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
