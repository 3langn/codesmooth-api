import { MailerOptions } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { isNil } from "lodash";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.getString("HOST");
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  get isTest(): boolean {
    return this.nodeEnv === "test";
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + " environment variable is not a number");
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + " env var is not a boolean");
    }
  }

  getString(key: string): string {
    const value = this.get(key);

    return value;
  }

  get nodeEnv(): string {
    return this.getString("NODE_ENV");
  }

  get postgresConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + "/../../entities/*.entity{.ts,.js}"];
    let migrations = [__dirname + "/../../database/migrations/*{.ts,.js}"];
    return {
      entities,
      synchronize: true,
      autoLoadEntities: true,
      // migrations,
      // keepConnectionAlive: !this.isTest,
      // dropSchema: this.isTest,
      ssl: this.getBoolean("DB_SSL"),
      type: "postgres",
      host: this.getString("DB_HOST"),
      port: this.getNumber("DB_PORT"),
      username: this.getString("DB_USER"),
      password: this.getString("DB_PASSWORD"),
      database: this.getString("DB_NAME"),
      // migrationsRun: true,
      logging: this.getBoolean("ENABLE_ORM_LOGS"),
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString("AWS_S3_BUCKET_REGION"),
      bucketApiVersion: this.getString("AWS_S3_API_VERSION"),
      bucketName: this.getString("AWS_S3_BUCKET_NAME"),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean("ENABLE_DOCUMENTATION");
  }

  get natsEnabled(): boolean {
    return this.getBoolean("NATS_ENABLED");
  }

  get authConfig() {
    return {
      privateKey: this.getString("JWT_PRIVATE_KEY"),
      publicKey: this.getString("JWT_PUBLIC_KEY"),
      jwtSecret: this.getString("JWT_SECRET"),
      jwtRefreshExpirationTime: this.getNumber("JWT_REFRESH_EXPIRATION_TIME"),
      jwtAccessExpirationTime: this.getString("JWT_ACCESS_EXPIRATION_TIME"),
    };
  }

  get appConfig() {
    return {
      port: this.getString("PORT"),
    };
  }

  getPostgresConfig() {
    return this.configService.get("typeorm");
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + " environment variable does not set"); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  get mailerConfig(): MailerOptions {
    return {
      transport: {
        host: this.getString("EMAIL_HOST"),
        port: this.getNumber("EMAIL_PORT"),
        secure: true, // true for 465, false for other ports
        auth: {
          user: this.getString("EMAIL_USER"), // generated ethereal user
          pass: this.getString("EMAIL_PASSWORD"), // generated ethereal password
        },
      },
      defaults: {
        from: '"nest-modules" <user@outlook.com>', // outgoing email ID
      },
      template: {
        dir: `${process.cwd()}/templates`,
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    };
  }

  get VnpayConfig() {
    return {
      vnp_TmnCode: this.getString("VNP_TMN_CODE"),
      vnp_HashSecret: this.getString("VNP_HASH_SECRET"),
      vnp_ReturnUrl: this.getString("VNP_RETURN_URL"),
      vnp_Locale: this.getString("VNP_LOCALE"),
      vnp_CurrCode: this.getString("VNP_CURR_CODE"),
      vnp_Command: this.getString("VNP_COMMAND"),
      vnp_Version: this.getString("VNP_VERSION"),
      vnp_VNPayUrl: this.getString("VNP_VNPayUrl"),
      vnp_RefundUrl: this.getString("VNP_REFUND_URL"),
    };
  }
}
