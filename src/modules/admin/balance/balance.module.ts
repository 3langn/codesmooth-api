import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BalanceService } from "./balance.service";
import { BalanceController } from "./balance.controller";
import { BalanceEntity } from "../../../entities/balance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([BalanceEntity])],
  providers: [BalanceService],
  controllers: [BalanceController],
  exports: [BalanceService],
})
export class AdminBalanceModule {}
