import { Controller, Get, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
@Controller("/health")
export class HealthController {
  private logger = new Logger(HealthController.name);
  @Get()
  getHello() {
    return {
      api: "CodeSmooth API",
      version: "1.0.0",
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  }

  @Cron("5 * * * * *")
  cronHeathCheck() {
    this.logger.log({
      api: "CodeSmooth API",
      version: "1.0.0",
      status: "OK",
      timestamp: new Date().toISOString(),
    });
  }
}
