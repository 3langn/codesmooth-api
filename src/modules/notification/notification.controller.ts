import { Controller, Get, Logger, Post, Query, Req } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { SocketService } from "../socket/socket.service";
import { NotificationService } from "./notification.service";
import { Auth, AuthUser } from "../../decorators";
import { CourseEntity } from "../../entities/course.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageDto } from "../../common/dto/page.dto";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { ResponseDefault } from "../../common/dto/response_default";
import { UserEntity } from "../../entities/user.entity";
@Controller("/notification")
export class NotificationController {
  constructor(
    private socketService: SocketService,
    private notificationService: NotificationService,
  ) {}

  private logger = new Logger(NotificationController.name);

  @Auth()
  @Get("/")
  async list(@AuthUser() user: UserEntity, @Query() query: PageOptionsDto) {
    const [r, itemCount] = await this.notificationService.list(user, query);

    return new PageDto(
      r,
      new PageMetaDto({
        pageOptionsDto: query,
        itemCount,
      }),
    );
  }

  @Auth()
  @Post("/read")
  async read(@Req() req: any, @Query("ids") ids: string[]) {
    await this.notificationService.read(req.user.id, ids);

    return new ResponseDefault();
  }
}
