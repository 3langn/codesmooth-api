import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateLessionDto } from "./lession.dto";
import { LessionService } from "./lession.service";

@Controller("admin/lession")
export class LessionController {
  constructor(private lessionService: LessionService) {}

  @Post("/")
  async createLession(@Body() body: CreateLessionDto) {
    return await this.lessionService.createLession(body);
  }

  @Get("/:lession_id")
  async getLessions(@Param("lession_id") lession_id: number) {
    return await this.lessionService.getLessions(lession_id);
  }
}
