import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserController } from "./user.controller";
import { UserEntity } from "../../entities/user.entity";
import { UserService } from "./user.service";
import { UserSettingsEntity } from "../../entities/user-settings.entity";
import { CacheModule } from "../cache/cache.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserSettingsEntity]), CacheModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
