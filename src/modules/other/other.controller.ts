import { Body, Controller, Get, Logger, Post } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import axios from "axios";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { Flags } from "lighthouse";
import lighthouse from "lighthouse";
import { OtherService } from "./other.service";
import { ContactRequest } from "./dto/contact.dto";
import { ResponseDefault } from "../../common/dto/response_default";
@Controller("/other")
export class OtherControler {
  constructor(private configService: ApiConfigService, private otherService: OtherService) {}

  @Post("/contact")
  async contact(@Body() data: ContactRequest) {
    await this.otherService.contactUs(data);
    return new ResponseDefault("success");
  }
}
