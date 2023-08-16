import { Module } from "@nestjs/common";
import { BalanceController } from "./balance.controller";

@Module({
  controllers: [BalanceController],
})
export class BalanceModule {}
