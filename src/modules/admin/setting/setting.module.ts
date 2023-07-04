import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SampleEntity } from "../../../entities/sample.entity";
import { SettingService } from "./setting.service";
import { SettingEntity } from "../../../entities/setting.entity";
import { SettingController } from "./setting.controller";

@Module({
  imports: [TypeOrmModule.forFeature([SettingEntity])],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
