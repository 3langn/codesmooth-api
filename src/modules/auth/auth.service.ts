import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { TokenType } from "../../common/constants/token-type";
import { Platform } from "../../common/enum/platform";
import { UserRole } from "../../common/enum/user-role";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { generateHash, validateHash } from "../../common/utils";
import { ApiConfigService } from "../../shared/services/api-config.service";

import { Social, UserEntity } from "../../entities/user.entity";
import { UserService } from "../user/user.service";
import { PayloadDto, TokenPayloadDto } from "../jwt/dtos/TokenPayloadDto";
import type { UserLoginDto } from "./dto/UserLoginDto";
import { UserRegisterDto } from "./dto/UserRegisterDto";
import { MailerService } from "../mailer/mailer.service";
import { TemplateId } from "../mailer/enum/template-id";
import { JwtService } from "../jwt/jwt.service";
import { ForgotPasswordDto as ForgotPasswordDto } from "./dto/ForgotPasswordDto";
import { ChangePasswordDto } from "./dto/ChangePasswordDto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ResetPasswordDto } from "./dto/ResetPasswordDto";
import { TokenEntity } from "../../entities/token.entity";
import { generateId } from "../../common/generate-nanoid";
import { UserSettingsEntity } from "../../entities/user-settings.entity";
import { GoogleAuthService, SocialService } from "./social.service";

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private mailerService: MailerService,
    private jwtService: JwtService,
    private googleAuthService: GoogleAuthService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserSettingsEntity)
    private readonly userSettingsRepository: Repository<UserSettingsEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private configService: ApiConfigService,
  ) {}

  // async createAccessToken(data: { userId: string }): Promise<TokenPayloadDto> {
  //   return new TokenPayloadDto({
  //     expiresIn: this.configService.authConfig.jwtExpirationTime,
  //     accessToken: await this.jwtService.signAsync({
  //       userId: data.userId,
  //       type: TokenType.ACCESS_TOKEN,
  //     }),
  //   });
  // }

  async login(userLoginDto: UserLoginDto): Promise<UserEntity> {
    try {
      const user = await this.userService.findOne({
        email: userLoginDto.email,
        settings: {
          isEmailVerified: true,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = await validateHash(userLoginDto.password, user.password);

      if (!isPasswordValid) {
        throw new Error("Password doesn't match");
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: StatusCodesList.EmailOrPasswordIncorrect,
        message: "Tài khoản hoặc mật khẩu không đúng",
      });
    }
  }

  socialSerivce(social: Social): SocialService {
    switch (social) {
      case "google":
        return this.googleAuthService;
      default:
        return null;
    }
  }

  async loginSocial(token: string, social: Social): Promise<UserEntity> {
    const socialService = this.socialSerivce(social);
    const user = await socialService.login(token);
    if (!user) {
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: StatusCodesList.InvalidCredentials,
        message: "Thông tin đăng nhập không hợp lệ",
      });
    }
    return user;
  }

  async register(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = await this.userService.createUser(userRegisterDto);
    const token = this.jwtService.generateVerifyEmailToken(user.id);
    await this.tokenRepository.upsert(
      {
        id: generateId(9),
        user_id: user.id,
        type: TokenType.VERIFY_EMAIL_TOKEN,
        token,
        expires_at: new Date(new Date().getTime() + 3600 * 1000),
      },
      {
        conflictPaths: ["user_id", "type"],
      },
    );
    this.mailerService
      .sendMail({
        template_id: TemplateId.EMAIL_VERIFICATION,
        data: {
          content: {
            token: this.configService.frontendUrl + "/verify-email?token=" + token,
            username: user.username,
          },
          subject: "Xác minh email đăng ký tài khoản",
          to: userRegisterDto.email,
          from: "noreply@codedrafts.com",
        },
      })
      .then(() => {
        this.logger.log("Send email verification successfully");
      })
      .catch((error) => {
        this.logger.error(error);
      });

    return user;
  }

  async verifyEmail(token: string): Promise<void> {
    const t = await this.verifyToken(TokenType.VERIFY_EMAIL_TOKEN, token);

    await this.userSettingsRepository.update(
      {
        user_id: t.user_id,
      },
      {
        isEmailVerified: true,
      },
    );
  }

  private async verifyToken(type: TokenType, token: string) {
    const payload = this.jwtService.verifyToken(token, type);

    const tokenRecord = await this.tokenRepository.findOne({
      where: {
        user_id: payload.sub,
        type: type,
        token,
      },
    });

    if (!tokenRecord) {
      throw new CustomHttpException({
        statusCode: HttpStatus.NOT_FOUND,
        code: StatusCodesList.TokenNotFound,
        message: "Token không tồn tại",
      });
    }

    if (new Date() > tokenRecord.expires_at) {
      throw new CustomHttpException({
        statusCode: HttpStatus.NOT_FOUND,
        code: StatusCodesList.TokenNotFound,
        message: "Token đã hết hạn",
      });
    }

    await this.tokenRepository.update(
      {
        id: tokenRecord.id,
      },
      {
        expires_at: new Date(),
      },
    );
    return tokenRecord;
  }

  async forgotPassword(body: ForgotPasswordDto): Promise<void> {
    const user = await this.userService.findOne({
      email: body.email,
    });

    if (!user) {
      throw new CustomHttpException({
        statusCode: HttpStatus.NOT_FOUND,
        code: StatusCodesList.UserNotFound,
        message: "User not found",
      });
    }

    await this.tokenRepository.upsert(
      {
        id: generateId(9),
        user_id: user.id,
        type: TokenType.REFRESH_TOKEN,
        token: this.jwtService.generateResetPasswordToken(user.id),
        expires_at: new Date(new Date().getTime() + 3600 * 1000),
      },
      {
        conflictPaths: ["user_id", "type"],
      },
    );

    this.mailerService
      .sendMail({
        template_id: TemplateId.RESET_PASSWORD,
        data: {
          content: {
            token:
              this.configService.frontendUrl +
              "/reset-password?token=" +
              this.jwtService.generateResetPasswordToken(user.id),
            username: user.username,
          },
          subject: "Cài đặt lại mật khẩu",
          to: body.email,
          from: "noreply@codedrafts.com",
        },
      })
      .then(() => {
        this.logger.log("Send email reset password successfully");
      });
  }

  async resetPassword(body: ResetPasswordDto): Promise<void> {
    const t = await this.verifyToken(TokenType.RESET_PASSWORD_TOKEN, body.token);

    await this.tokenRepository.update(
      {
        id: t.id,
      },
      {
        expires_at: new Date(),
      },
    );

    await this.userRepository.update(
      {
        id: t.user_id,
      },
      {
        password: generateHash(body.password),
      },
    );
  }

  async changePassword(body: ChangePasswordDto, user: UserEntity): Promise<void> {
    const isPasswordValid = await validateHash(body.password, user.password);

    if (!isPasswordValid) {
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: StatusCodesList.EmailOrPasswordIncorrect,
        message: "Mật khẩu cũ không đúng",
      });
    }

    user.password = body.newPassword;
    await this.userRepository.save(user);
  }
}
