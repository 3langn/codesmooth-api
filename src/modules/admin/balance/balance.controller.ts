import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { Auth, AuthUser } from "../../../decorators";
import { UserEntity } from "../../../entities/user.entity";
import { ResponseDefault } from "../../../common/dto/response_default";
import { UserRole } from "../../../common/enum/user-role";

@Controller("admin/balance")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Auth([UserRole.ADMINSTRATOR])
  @Get("/")
  async totalIncome() {
    const r = await this.balanceService.getBalance();

    return new ResponseDefault("Thành công", r);
  }
}
