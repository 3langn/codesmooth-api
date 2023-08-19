import { Controller, Get, Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import axios from "axios";
import { ApiConfigService } from "../../shared/services/api-config.service";
import { Flags } from "lighthouse";
import lighthouse from "lighthouse";
import { SocketService } from "../socket/socket.service";
import { ResponseDefault } from "../../common/dto/response_default";
import { InjectRepository } from "@nestjs/typeorm";
import {
  NotificationBody,
  NotificationEntity,
  NotificationType,
} from "../../entities/notification.entity";
import { In, Repository } from "typeorm";
import { CourseEntity } from "../../entities/course.entity";
import { TransactionEntity } from "../../entities/transaction.entity";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { queryPagination } from "../../common/utils";
import { UserEntity } from "../../entities/user.entity";
import { UserRole } from "../../common/enum/user-role";
@Injectable()
export class NotificationService {
  constructor(
    private socketService: SocketService,
    @InjectRepository(NotificationEntity) private notificationRepo: Repository<NotificationEntity>,
  ) {}
  private logger = new Logger(NotificationService.name);

  notifyPayCourseResult = async (
    course: CourseEntity,
    trans: TransactionEntity,
    isSuccess: boolean,
  ) => {
    const uSocketId = await this.socketService.getSocketId(trans.user_id);
    const iSocketId = await this.socketService.getSocketId(course.owner_id);
    const aSocketIds = await this.socketService.getAdminSocketIds();

    this.socketService.getSocket.to(uSocketId).emit(
      "customer:pay-course-result",
      new ResponseDefault(undefined, {
        is_success: isSuccess,
        transId: trans.id,
      }),
    );

    await this.notiToUser(
      uSocketId,
      trans.user_id,
      "customer:notification",
      "Kết quả thanh toán khóa học",
      {
        message: isSuccess
          ? `Chúc mừng bạn đã mua khóa học ${course.name}. Hãy bắt đầu học ngay nào!`
          : `Thanh toán thất bại cho khóa học ${course.name}, vui lòng liên hệ chúng tôi để được hỗ trợ`,
      },
      NotificationType.USER_PAYMENT,
    );
    await this.notiToUser(
      iSocketId,
      course.owner_id,
      "customer:notification",
      "Thông báo thanh toán khóa học",
      {
        message: `Bạn vừa nhận được thanh toán từ khóa học ${course.name}`,
        income: trans.instructor_income,
      },
      NotificationType.INCOME,
    );
    await this.notiToUser(
      aSocketIds,
      null,
      "admin:notification",
      "Thông báo thanh toán khóa học",
      {
        message: `Bạn vừa nhận được thanh toán từ chiết khấu khóa học ${course.name} - ${course.id}`,
        income: trans.income,
      },
      NotificationType.INCOME,
    );
  };

  private async notiToUser(
    socketId: string | string[],
    userId: number | null,
    event: string,
    title: string,
    body: NotificationBody,
    type: NotificationType,
  ) {
    const noti = this.notificationRepo.create({
      title,
      type,
      user_id: userId,
      body,
    });

    await this.notificationRepo.save(noti);

    this.socketService.getSocket.to(socketId).emit(event, new ResponseDefault(undefined, noti));
  }

  async list(user: UserEntity, o: PageOptionsDto) {
    const q = this.notificationRepo
      .createQueryBuilder("noti")
      .where("noti.user_id = :userId", { userId: user.id });

    if (user.role === UserRole.ADMINSTRATOR) {
      q.orWhere("noti.user_id IS NULL");
    }

    return queryPagination({ query: q, o });
  }

  async read(user: UserEntity, ids: string[]) {
    await this.notificationRepo.update(
      {
        id: In(ids),
        user_id: user.role === UserRole.ADMINSTRATOR ? In([user.id, null]) : user.id,
      },
      { read: true },
    );

    return new ResponseDefault();
  }
}
