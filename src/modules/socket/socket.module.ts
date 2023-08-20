import { Module, Global } from "@nestjs/common";
import { SocketService } from "./socket.service";
import { EventsGateway } from "./socket.gateway";
import { CacheModule } from "../cache/cache.module";
import { UserModule } from "../user/user.module";
import { JwtModule } from "../jwt/jwt.module";

@Module({
  imports: [CacheModule, UserModule, JwtModule],
  controllers: [],
  providers: [SocketService, EventsGateway],
  exports: [SocketService],
})
export class SocketModule {}
