import { ApiProperty } from "@nestjs/swagger";

import { UserDto } from "../../user/dtos/user.dto";
import { TokenPayloadDto } from "../../jwt/dtos/TokenPayloadDto";
import { IsEnum, IsString } from "class-validator";
import { Social } from "../../../entities/user.entity";

export class LoginPayloadDto {
  user: UserDto;

  token: TokenPayloadDto;

  constructor(user: UserDto, token: TokenPayloadDto) {
    this.user = user;
    this.token = token;
  }
}

export class LoginGoogleRequest {
  @IsString()
  token: string;

  @IsEnum(["facebook", "google", "github"])
  social: Social;
}
