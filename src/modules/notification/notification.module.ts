import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { SocketModule } from "../socket/socket.module";
import { NotificationEntity } from "../../entities/notification.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [SocketModule, TypeOrmModule.forFeature([NotificationEntity])],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
