import { Controller, Get, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import axios from "axios";
import { Flags } from "lighthouse";
import lighthouse from "lighthouse";
import { ApiConfigService } from "../../shared/services/api-config.service";
@Controller("/balance")
export class BalanceController {
  constructor(private configService: ApiConfigService) {}
  private logger = new Logger(BalanceController.name);
}
