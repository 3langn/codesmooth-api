import { HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { OAuth2Client } from "google-auth-library";
import { UserService } from "../user/user.service";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { UserEntity } from "../../entities/user.entity";

export interface SocialService {
  login: (accessToken: string) => Promise<UserEntity>;
}

@Injectable()
export class GoogleAuthService implements SocialService {
  private readonly logger: Logger = new Logger(GoogleAuthService.name);
  private readonly client: OAuth2Client;

  constructor(
    private readonly apiConfigService: ApiConfigService,
    private readonly userService: UserService,
  ) {
    this.client = new OAuth2Client(
      this.apiConfigService.GoogleConfig.APP_ID,
      this.apiConfigService.GoogleConfig.APP_SECRET,
    );
  }
  async getUser(accessToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: accessToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  }

  async login(token: string) {
    try {
      const Guser = await this.getUser(token);

      let user = await this.userService.findOne({
        email: Guser.email,
        settings: {
          isEmailVerified: true,
        },
      });

      if (!user) {
        // register
        user = await this.userService.createUserSocial({
          email: Guser.email,
          avatar: Guser.picture,
          social: "google",
          username: Guser.name,
        });
      }
      return user;
    } catch (error) {
      throw new CustomHttpException({
        statusCode: HttpStatus.UNAUTHORIZED,
        code: StatusCodesList.InvalidCredentials,
        message: "Có lỗi xảy ra",
        error,
      });
    }
  }
}
