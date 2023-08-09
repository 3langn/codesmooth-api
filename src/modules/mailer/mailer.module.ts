import { Module } from "@nestjs/common";
import { MailerModule as NestMailerModule } from "@nestjs-modules/mailer";
import { SharedModule } from "../../shared/services/shared.module";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { MailerService } from "./mailer.service";
import { JwtModule } from "../jwt/jwt.module";

@Module({
  imports: [
    JwtModule,
    NestMailerModule.forRootAsync({
      imports: [SharedModule],
      useFactory: async (apiConfigService: ApiConfigService) => {
        return apiConfigService.mailerConfig;
      },
      inject: [ApiConfigService],
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
