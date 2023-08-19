import { Inject, Injectable, Logger } from "@nestjs/common";
import { RedisClientType } from "redis";
import { Server } from "socket.io";
@Injectable()
export class SocketService {
  public socket: Server = null;
  constructor(@Inject("CacheService") private cacheManager: RedisClientType) {}
  get getSocket() {
    return this.socket;
  }

  async getSocketId(userId: number) {
    return this.cacheManager.get("socket:" + userId);
  }

  async setSocketId(userId: number, socketId: string) {
    await this.cacheManager.setEx("socket:" + userId, 60 * 60 * 24, socketId);
  }

  async setAdminSocketId(socketId: string) {
    await this.cacheManager.lPush("admin_socket", socketId);
  }

  async getAdminSocketIds() {
    return this.cacheManager.lRange("admin_socket", 0, -1);
  }
  async deleteSocketId(userId: number) {
    await this.cacheManager.DEL("socket:" + userId);
  }
}
