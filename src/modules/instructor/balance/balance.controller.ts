import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { InstructorBalanceService } from "./balance.service";
import { Auth, AuthUser } from "../../../decorators";
import { UserEntity } from "../../../entities/user.entity";
import { ResponseDefault } from "../../../common/dto/response_default";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { PageDto } from "../../../common/dto/page.dto";
import { PageMetaDto } from "../../../common/dto/page-meta.dto";

@Controller("instructor/balance")
export class InstructorBalanceController {
  constructor(private readonly balanceService: InstructorBalanceService) {}

  @Auth()
  @Get("/list")
  async list(@AuthUser() user: UserEntity, @Query() pageOptionsDto: PageOptionsDto) {
    const [rs, itemCount] = await this.balanceService.instructorBalanceHistory(
      user.id,
      pageOptionsDto,
    );

    return new PageDto(rs, new PageMetaDto({ itemCount, ...pageOptionsDto }), "Thành công");
  }

  @Auth()
  @Get("/")
  async totalIncome(@AuthUser() user: UserEntity) {
    const r = await this.balanceService.getBalance(user.id);

    return new ResponseDefault("Thành công", r);
  }
}
