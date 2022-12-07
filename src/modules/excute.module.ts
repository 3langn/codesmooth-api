import { Module } from "@nestjs/common";
import { ExcuteController } from "./excute.controller";

@Module({
  controllers: [ExcuteController],
})
export class ExcuteModule {}
