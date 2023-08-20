import { Module } from "@nestjs/common";
import * as Redis from "redis";
import { ApiConfigService } from "../../shared/services/api-config.service";
@Module({
  providers: [
    {
      provide: "CacheService",
      inject: [ApiConfigService],
      useFactory: async (configService: ApiConfigService) => {
        if (configService.RedisConfig.enabled === false) {
          return null;
        }
        const redisClient = Redis.createClient({
          url: `redis://default:${configService.RedisConfig.password}@${configService.RedisConfig.host}:${configService.RedisConfig.port}`,
          pingInterval: 1000,
        });

        await redisClient.connect();

        await redisClient
          .ping()
          .then((res) => {
            console.log("Redis connected", res);
          })
          .catch((err) => {
            console.log("Redis connection failed", err);
          });

        return redisClient;
      },
    },
  ],
  exports: ["CacheService"],
})
export class RedisCacheModule {}
