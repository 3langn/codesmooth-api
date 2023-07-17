import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SampleEntity } from "../../../entities/sample.entity";
import { SampleController } from "./sample.controller";
import { SampleService } from "./sample.service";

@Module({
  imports: [TypeOrmModule.forFeature([SampleEntity])],
  controllers: [SampleController],
  providers: [SampleService],
})
export class SampleModule {}
