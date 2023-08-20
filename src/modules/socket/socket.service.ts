import { Inject, Injectable, Logger } from "@nestjs/common";
import { Server } from "socket.io";
import { CacheService } from "../cache/cache.service";
@Injectable()
export class SocketService {
  public socket: Server = null;
  constructor(private cacheManager: CacheService) {}
  get getSocket() {
    return this.socket;
  }

  async getSocketId(userId: number) {
    return this.cacheManager.get("socket:" + userId);
  }

  async setSocketId(userId: number, socketId: string) {
    await this.cacheManager.set("socket:" + userId, socketId, 60 * 60 * 24);
  }

  async setAdminSocketId(socketId: string) {
    await this.cacheManager.setList("admin_socket", socketId);
  }

  async getAdminSocketIds() {
    return this.cacheManager.getList("admin_socket");
  }
  async deleteSocketId(userId: number) {
    await this.cacheManager.delete("socket:" + userId);
  }
}
