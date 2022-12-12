import { Module } from "@nestjs/common";
import { ExcuteController } from "./execute.controller";
import { ExecuteService } from "./execute.service";

@Module({
  controllers: [ExcuteController],
  providers: [ExecuteService],
})
export class ExcuteModule {}
