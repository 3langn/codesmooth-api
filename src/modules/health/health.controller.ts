import { Controller, Get } from "@nestjs/common";
@Controller()
export class HealthController {
  @Get()
  getHello() {
    return {
      api: "CodeSmooth API",
      version: "1.0.0",
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  }
}
