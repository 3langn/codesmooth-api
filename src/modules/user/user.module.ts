import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserController } from "./user.controller";
import { UserEntity } from "../../entities/user.entity";
import { UserService } from "./user.service";
import { UserSettingsEntity } from "../../entities/user-settings.entity";
import { RedisCacheModule } from "../redis/redis.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserSettingsEntity]), RedisCacheModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
