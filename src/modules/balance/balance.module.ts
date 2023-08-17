import { Module } from "@nestjs/common";
import { BalanceController } from "./balance.controller";
import { BalanceService } from "./balance.service";

@Module({
  controllers: [BalanceController],
  exports: [BalanceService],
  providers: [BalanceService],
})
export class BalanceModule {}
