import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { Auth } from "../../../decorators";
import { UserRole } from "../../../common/enum/user-role";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { PageMetaDto } from "../../../common/dto/page-meta.dto";
import { PageDto } from "../../../common/dto/page.dto";

@Controller("admin/transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Auth([UserRole.ADMINSTRATOR])
  @Get("/list")
  async list(@Query() o: PageOptionsDto) {
    const [data, itemCount] = await this.transactionService.getListTransaction(o);

    return new PageDto(
      data,
      new PageMetaDto({
        itemCount,
        pageOptionsDto: o,
      }),
    );
  }
}
