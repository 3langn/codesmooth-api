import { Controller, Get, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import axios from "axios";
@Controller("/rating")
export class RatingController {
  private logger = new Logger(RatingController.name);
}
