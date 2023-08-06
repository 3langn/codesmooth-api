import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { TokenType } from "../../common/constants/token-type";
import { ApiConfigService } from "../../shared/services/api-config.service";
import type { UserEntity } from "../../entities/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ApiConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.jwtSecret,
    });
  }

  async validate(args: { sub: number; type: TokenType }): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne({
      id: args.sub,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
