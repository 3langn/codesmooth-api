import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SampleEntity } from "../../entities/sample.entity";
import { ExcuteController } from "./execute.controller";
import { ExecuteService } from "./execute.service";

@Module({
  imports: [TypeOrmModule.forFeature([SampleEntity])],
  controllers: [ExcuteController],
  providers: [ExecuteService],
})
export class ExcuteModule {}
