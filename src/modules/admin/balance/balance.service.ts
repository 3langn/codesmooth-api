import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BalanceEntity } from "../../../entities/balance.entity";
@Injectable()
export class BalanceService {
  private logger = new Logger(BalanceService.name);
  constructor(
    @InjectRepository(BalanceEntity)
    private readonly balanceRepository: Repository<BalanceEntity>,
  ) {}

  async getBalance() {
    const qb = this.balanceRepository.findOne({
      where: {},
    });
    return await qb;
  }
}
