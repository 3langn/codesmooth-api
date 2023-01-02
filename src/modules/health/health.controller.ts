import { Controller, Get } from "@nestjs/common";
@Controller("/health")
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
