import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { TokenType } from "../../common/constants/token-type";
import { Platform } from "../../common/enum/platform";
import { UserRole } from "../../common/enum/user-role";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { validateHash } from "../../common/utils";
import { ApiConfigService } from "../../shared/services/api-config.service";

import type { UserEntity } from "../../entities/user.entity";
import { UserService } from "../user/user.service";
import { TokenPayloadDto } from "../jwt/dtos/TokenPayloadDto";
import type { UserLoginDto } from "./dto/UserLoginDto";
import { UserRegisterDto } from "./dto/UserRegisterDto";
import { MailerService } from "../mailer/mailer.service";
import { TemplateId } from "../mailer/enum/template-id";
import { JwtService } from "../jwt/jwt.service";

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private mailerService: MailerService,
    private jwtService: JwtService,
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

  async register(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const user = await this.userService.createUser(userRegisterDto);

    this.mailerService
      .sendMail({
        template_id: TemplateId.EMAIL_VERIFICATION,
        data: {
          content: {
            token: this.jwtService.generateVerifyEmailToken(user.id),
          },
          subject: "Xác minh email đăng ký tài khoản",
          to: userRegisterDto.email,
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
}
