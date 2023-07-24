import { Controller, Get, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import axios from "axios";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { Flags } from "lighthouse";
import lighthouse from "lighthouse";
@Controller("/health")
export class HealthController {
  constructor(private configService: ApiConfigService) {}
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
  async cronHeathCheck() {
    try {
      await axios.get(this.configService.host + "/api/health");
    } catch (error) {}
  }
  // @Get("/hihi")
  // async seoCheck() {
  //   const options: Flags = {
  //     logLevel: "info",
  //     output: "html",
  //     onlyCategories: ["performance"],
  //     port: 8082,
  //   };

  //   const runnerResult = await lighthouse("https://codedrafts.com", options);

  //   return {
  //     props: {
  //       reportHtml: runnerResult?.report,
  //       finalDisplayedUrl: runnerResult?.lhr.finalDisplayedUrl,
  //       performanceScore: runnerResult?.lhr.categories.performance?.score,
  //     },
  //   };
  // }
}
