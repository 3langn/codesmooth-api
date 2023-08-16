import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { Auth, AuthUser } from "../../../decorators";
import { UserEntity } from "../../../entities/user.entity";
import { ResponseDefault } from "../../../common/dto/response_default";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";

@Controller("instructor/transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Auth()
  @Get("/")
  async list(@AuthUser() user: UserEntity, @Query() pageOptionsDto: PageOptionsDto) {
    const r = await this.transactionService.instructorTransactions(user.id, pageOptionsDto);

    return new ResponseDefault("Success", r);
  }

  @Auth()
  @Get("/total-income")
  async totalIncome(@AuthUser() user: UserEntity) {
    const r = await this.transactionService.totalIncome(user.id);

    return new ResponseDefault("Success", r);
  }
}
