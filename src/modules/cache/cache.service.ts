import { Inject } from "@nestjs/common";
import { RedisClientType } from "redis";
import { ApiConfigService } from "../../shared/services/api-config.service";

export class CacheService {
  private isEnable: boolean;
  constructor(
    @Inject("CacheService") private cacheManager: RedisClientType,
    private configService: ApiConfigService,
  ) {
    this.isEnable = this.configService.RedisConfig.enabled;
  }

  async get(key: string): Promise<any> {
    if (!this.isEnable) return null;
    const cache = await this.cacheManager.GET(key);

    if (!cache) {
      return null;
    }
    return JSON.parse(cache);
  }

  async set(key: string, value: any, ttl: number = 60 * 60 * 24 * 7): Promise<void> {
    if (!this.isEnable) return null;

    await this.cacheManager.SETEX(key, ttl, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    if (!this.isEnable) return null;

    await this.cacheManager.DEL(key);
  }

  async getList(key: string): Promise<any> {
    if (!this.isEnable) return null;
    return await this.cacheManager.LRANGE(key, 0, -1);
  }

  async setList(key: string, values: any, ttl: number = 60 * 60 * 24 * 7): Promise<void> {
    if (!this.isEnable) return null;

    await this.cacheManager.RPUSH(key, values);
    await this.cacheManager.EXPIRE(key, ttl);
  }

  async lpos(key: string, value: any) {
    if (!this.isEnable) return null;
    return await this.cacheManager.LPOS(key, value);
  }

  async lset(key: string, index: number, value: any) {
    if (!this.isEnable) return null;
    return await this.cacheManager.LSET(key, index, value);
  }

  async replaceValueInList(key: string, oldValue: any, newValue: any) {
    if (!this.isEnable) return null;
    const index = await this.lpos(key, oldValue);
    if (index === null) return;
    await this.lset(key, index, newValue);
  }
}
