import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { InstructorBalanceService } from "./balance.service";
import { InstructorBalanceController } from "./balance.controller";
import { InstructorBalanceHistoryEntity } from "../../../entities/instructor_balance_history.entity";
import { InstructorBalanceEntity } from "../../../entities/instructor_balance.entity";

@Module({
  imports: [TypeOrmModule.forFeature([InstructorBalanceHistoryEntity, InstructorBalanceEntity])],
  providers: [InstructorBalanceService],
  controllers: [InstructorBalanceController],
  exports: [InstructorBalanceService],
})
export class InstructorBalanceModule {}
