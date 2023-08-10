import { Module } from "@nestjs/common";
import { RatingController as RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";

@Module({
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
