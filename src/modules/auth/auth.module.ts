import { forwardRef, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PublicStrategy } from "./public.strategy";
import { JwtModule } from "../jwt/jwt.module";
import { MailerModule } from "../mailer/mailer.module";
import { UserSettingsEntity } from "../../entities/user-settings.entity";
import { UserEntity } from "../../entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TokenEntity } from "../../entities/token.entity";
import { FacebookAuthService, GithubAuthService, GoogleAuthService } from "./social.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserSettingsEntity, TokenEntity]),
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: "jwt" }),
    MailerModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PublicStrategy,
    GoogleAuthService,
    FacebookAuthService,
    GithubAuthService,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
