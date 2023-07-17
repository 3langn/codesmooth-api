import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateSampleDto } from "./sample.dto";
import { SampleService } from "./sample.service";
import { ResponseDefault } from "../../../common/dto/response_default";

@Controller("instructor/sample")
export class SampleController {
  constructor(private sampleService: SampleService) {}

  @Post("/")
  async createSample(@Body() body: CreateSampleDto) {
    return await this.sampleService.createSample(body);
  }

  @Get("/:language")
  async getSample(@Param("language") language: string) {
    return new ResponseDefault("success", await this.sampleService.getSample(language));
  }
}
