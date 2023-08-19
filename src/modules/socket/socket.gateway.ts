import { Inject, Logger, UseFilters } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketService } from "./socket.service";
import { JwtService } from "../jwt/jwt.service";
import { TokenType } from "../../common/constants/token-type";
import { WebsocketExceptionsFilter } from "../../common/filter/exception.filter";
import { RedisClientType } from "redis";
import { UserService } from "../user/user.service";
import { UserRole } from "../../common/enum/user-role";
@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "/api",
  transports: ["websocket"],
})
@UseFilters(WebsocketExceptionsFilter) // NOT WORKING
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger(EventsGateway.name);

  constructor(
    private socketService: SocketService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  async handleDisconnect(client: Socket) {
    if (!client.handshake.query.token) {
      // throw new WsException("Unauthorized");
      client.disconnect();
    }

    const payload = this.jwtService.verifyToken(
      client.handshake.query.token as string,
      TokenType.ACCESS_TOKEN,
    );

    this.socketService.deleteSocketId(payload.sub);

    this.logger.log(`Client disconnected: ${client.id} ${payload.sub}}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      if (!client.handshake.query.token) {
        // throw new WsException("Unauthorized");
        this.server.emit("exception", "Unauthorized");
        client.disconnect();
      }

      const payload = this.jwtService.verifyToken(
        client.handshake.query.token as string,
        TokenType.ACCESS_TOKEN,
      );

      const u = await this.userService.findOneById(payload.sub, false);

      if (u.role === UserRole.ADMINSTRATOR) {
        await this.socketService.setAdminSocketId(client.id);
      }
      await this.socketService.setSocketId(payload.sub, client.id);

      this.logger.log(`Client connected: ${client.id} ${payload.sub}`);
    } catch (error) {
      // throw new WsException("Unauthorized");
      this.logger.error(error);
      this.server.emit("exception", "Unauthorized");
      client.disconnect();
    }
  }
}
