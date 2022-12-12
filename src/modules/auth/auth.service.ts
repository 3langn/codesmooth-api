import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { TokenType } from "../../common/constants/token-type";
import { Platform } from "../../common/enum/platform";
import { UserRole } from "../../common/enum/user-role";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { validateHash } from "../../common/utils";
import { ApiConfigService } from "../../shared/services/api-config.service";

import type { UserEntity } from "../../entities/user.entity";
import { UserService } from "../user/user.service";
import { TokenPayloadDto } from "./dto/TokenPayloadDto";
import type { UserLoginDto } from "./dto/UserLoginDto";

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService
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

  async generateAuthToken(user: UserEntity): Promise<TokenPayloadDto> {
    const access_token = this.generateToken(
      user.id,
      TokenType.ACCESS_TOKEN,
      this.configService.authConfig.jwtAccessExpirationTime
    );

    const refresh_token = this.generateToken(
      user.id,
      TokenType.REFRESH_TOKEN,
      0
    );
    // await this.saveToken(refresh_token, user, TokenType.RefreshToken);
    return {
      access_token,
      refresh_token,
      expiresIn: this.configService.authConfig.jwtAccessExpirationTime,
    };
  }

  // async saveToken(token: string, user: UserEntity, tokenType: TokenType) {
  //   let tokenDoc = await this.tokenRepo.findOne({
  //     where: { user, type: tokenType },
  //   });
  //   if (tokenDoc) {
  //     tokenDoc.token = token;
  //     tokenDoc.active = true;
  //   } else {
  //     tokenDoc = this.tokenRepo.create({
  //       token,
  //       user,
  //       type: tokenType,
  //     });
  //   }
  //   return this.tokenRepo.save(tokenDoc);
  // }

  generateToken(user_id: number, type: string, expiresIn: number) {
    const payload = { sub: user_id, type };
    return this.jwtService.sign(payload, {
      expiresIn: expiresIn,
      secret: this.configService.authConfig.jwtSecret,
    });
  }

  async login(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const role =
      userLoginDto.requestFrom === Platform.ADMIN
        ? UserRole.ADMINSTRATOR
        : UserRole.USER;
    try {
      const user = await this.userService.findOne({
        email: userLoginDto.email,
        role,
      });

      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = await validateHash(
        userLoginDto.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error("Password doesn't match");
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: StatusCodesList.EmailOrPasswordIncorrect,
        message: error.message,
      });
    }
  }
}
