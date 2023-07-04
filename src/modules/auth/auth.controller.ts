import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";

import { UserDto } from "../user/dtos/user.dto";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginPayloadDto } from "./dto/LoginPayloadDto";
import { UserLoginDto } from "./dto/UserLoginDto";
import { UserRegisterDto } from "./dto/UserRegisterDto";
import { JwtService } from "../jwt/jwt.service";

@Controller("auth")
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post("login")
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: "User info with access token",
  })
  async login(@Body() userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.login(userLoginDto);
    const token = await this.jwtService.generateAuthToken(userEntity);
    return new LoginPayloadDto(userEntity.toDto(), token);
  }

  @Post("register")
  async register(@Body() userRegisterDto: UserRegisterDto): Promise<UserDto> {
    const createdUser = await this.authService.register(userRegisterDto);
    delete createdUser.password;
    return {
      ...createdUser,
      isActive: true,
    };
  }
}
