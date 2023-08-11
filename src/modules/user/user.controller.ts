import { Controller, Get, HttpCode, HttpStatus, Put, Query, ValidationPipe } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

import { ApiPageOkResponse, Auth, AuthUser, UUIDParam } from "../../decorators";
import { UserDto } from "./dtos/user.dto";
import { UsersPageOptionsDto } from "./dtos/users-page-options.dto";
import { UserEntity } from "../../entities/user.entity";
import { UserService } from "./user.service";
import { PageDto } from "../../common/dto/page.dto";
import { ResponseDefault } from "../../common/dto/response_default";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Auth()
  @Get("/me")
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user;
  }

  @Auth()
  @Put("/")
  async updateCurrentUser(@AuthUser() user: UserEntity, @Query() data: UserDto) {
    await this.userService.updateUser(user.id, data);

    return new ResponseDefault("Cập nhật thành công");
  }

  @Get("/info/:id")
  async getUserInfo(@UUIDParam("id") id: string) {
    const user = await this.userService.getUser(id);

    return new ResponseDefault("Lấy thông tin thành công", user);
  }
}
