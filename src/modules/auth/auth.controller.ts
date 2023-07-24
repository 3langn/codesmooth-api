import { Body, Controller, Post, Req } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";

import { UserDto } from "../user/dtos/user.dto";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginPayloadDto } from "./dto/LoginPayloadDto";
import { UserLoginDto } from "./dto/UserLoginDto";
import { UserRegisterDto } from "./dto/UserRegisterDto";
import { JwtService } from "../jwt/jwt.service";
import { ForgotPasswordDto } from "./dto/ForgotPasswordDto";
import { ResponseDefault } from "../../common/dto/response_default";
import { ChangePasswordDto } from "./dto/ChangePasswordDto";
import { Auth } from "../../decorators";
import { ResetPasswordDto } from "./dto/ResetPasswordDto";

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

  @Post("verify-email")
  async verifyEmail(@Body() body: { token: string }): Promise<any> {
    const r = await this.authService.verifyEmail(body.token);
    return new ResponseDefault("Xác thực email thành công", r);
  }

  @Post("forgot-password")
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<any> {
    const r = await this.authService.forgotPassword(body);
    return new ResponseDefault("Gửi email cấp lại mật khẩu thành công", r);
  }

  @Post("reset-password")
  async resetPassword(@Body() body: ResetPasswordDto): Promise<any> {
    const r = await this.authService.resetPassword(body);
    return new ResponseDefault("Đặt lại mật khẩu thành công", r);
  }

  @Auth()
  @Post("change-password")
  async changePassword(@Body() body: ChangePasswordDto, @Req() req): Promise<any> {
    const r = await this.authService.changePassword(body, req.user);
    return new ResponseDefault("Đổi mật khẩu thành công", r);
  }
}
