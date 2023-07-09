import { Controller, Get, Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import axios from "axios";
@Injectable()
export class RatingService {
  private logger = new Logger(RatingService.name);
}
