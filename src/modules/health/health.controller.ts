import { Controller, Get, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import axios from "axios";
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

  @Cron("* 2 * * * *")
  cronHeathCheck() {
    axios.get("https://codesmooth.onrender.com/api/health");
  }
}
