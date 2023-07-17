import { Controller, Get, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import axios from "axios";
@Controller("/health")
export class HealthController {
  private logger = new Logger(HealthController.name);
  @Get()
  getHello() {
    return {
      api: "CodeDrafts API",
      version: "1.0.0",
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  }

  // every 5 minutes
  @Cron("0 */5 * * * *")
  cronHeathCheck() {
    try {
      axios.get("https://codedrafts.onrender.com/api/health");
    } catch (error) {}
  }
}
