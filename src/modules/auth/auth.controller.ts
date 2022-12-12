import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";

import { UserDto } from "../user/dtos/user.dto";
import { UserEntity } from "../../entities/user.entity";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginPayloadDto } from "./dto/LoginPayloadDto";
import { UserLoginDto } from "./dto/UserLoginDto";
import { UserRegisterDto } from "./dto/UserRegisterDto";

@Controller("auth")
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: "User info with access token",
  })
  async login(@Body() userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.login(userLoginDto);

    const token = await this.authService.generateAuthToken(userEntity);
    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Post("register")
  @HttpCode(HttpStatus.OK)
  async register(@Body() userRegisterDto: UserRegisterDto): Promise<UserDto> {
    const createdUser = await this.userService.createUser(userRegisterDto);
    delete createdUser.password;
    return {
      ...createdUser,
      isActive: true,
    };
  }
}
