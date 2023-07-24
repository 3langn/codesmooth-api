import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SampleEntity } from "../../../entities/sample.entity";
import { AdminSettingsService } from "./setting.service";
import { SettingEntity } from "../../../entities/setting.entity";
import { AdminSettingsController } from "./setting.controller";

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  controllers: [AdminSettingsController],
  providers: [AdminSettingsService],
})
export class AdminSettingsModule {}
