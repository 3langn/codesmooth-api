import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessionEntity } from "../../../entities/lession.entity";
import { LessionController } from "./lession.controller";
import { LessionService } from "./lession.service";

@Module({
  imports: [TypeOrmModule.forFeature([LessionEntity])],
  controllers: [LessionController],
  providers: [LessionService],
})
export class LessionModule {}
