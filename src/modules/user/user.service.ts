import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToClass } from "class-transformer";
import type { FindOptionsWhere } from "typeorm";
import { Repository } from "typeorm";

import { PageDto } from "../../common/dto/page.dto";
// import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from "../auth/dto/UserRegisterDto";
import type { UserDto } from "./dtos/user.dto";
import type { UsersPageOptionsDto } from "./dtos/users-page-options.dto";
import { UserEntity } from "../../entities/user.entity";
import { UserSettingsEntity } from "../../entities/user-settings.entity";
import { PageMetaDto } from "../../common/dto/page-meta.dto";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { UserRole } from "../../common/enum/user-role";
import { MailerService } from "../mailer/mailer.service";
import { TemplateId } from "../mailer/enum/template-id";
import { JwtService } from "../jwt/jwt.service";

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserSettingsEntity)
    private userSettingRepository: Repository<UserSettingsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>, // private validatorService: ValidatorService,
  ) {}

  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.settings", "settings");

    if (options.email) {
      queryBuilder.orWhere("user.email = :email", {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere("user.username = :username", {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  // @Transactional()
  async createUser(
    userRegisterDto: UserRegisterDto,
    // file?: IFile,
  ): Promise<UserEntity> {
    // TODO: check verify email
    const findUser = await this.userRepository.findOne({
      where: {
        email: userRegisterDto.email,
        role: UserRole.ADMINSTRATOR,
      },
      relations: ["settings"],
    });

    if (!findUser) {
      const user = this.userRepository.create(userRegisterDto);

      const userRecord = await this.userRepository.save(user);
      // if (file && !this.validatorService.isImage(file.mimetype)) {
      //   throw new FileNotImageException();
      // }

      // if (file) {
      //   user.avatar = await this.awsS3Service.uploadImage(file);
      // }
      const userSettings = this.userSettingRepository.create({
        isEmailVerified: false,
        user_id: userRecord.id,
      });

      user.settings = await this.userSettingRepository.save(userSettings);
      return user;
    }

    if (findUser.settings.isEmailVerified) {
      throw new CustomHttpException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: `Email ${userRegisterDto.email} already exists`,
        code: StatusCodesList.EmailAlreadyExists,
      });
    }

    return findUser;
  }

  async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
    const q = this.userRepository
      .createQueryBuilder("user")
      .select([
        "user.id",
        "user.email",
        "user.username",
        "user.role",
        "user.phone",
        "user.created_at",
        "user.status",
        "user.avatar",
        "user.updated_at",
      ])
      .leftJoinAndSelect("user.settings", "settings");

    pageOptionsDto.role && q.andWhere("user.role = :role", { role: pageOptionsDto.role });
    pageOptionsDto.search &&
      q.andWhere("user.username ILIKE :username", {
        username: `%${pageOptionsDto.search}%`,
      });

    const [users, itemCount] = await q
      .take(pageOptionsDto.take)
      .skip(pageOptionsDto.skip)
      .orderBy(`user.${pageOptionsDto.sort}`, pageOptionsDto.order)
      .getManyAndCount();

    return new PageDto<UserDto>(
      users,
      new PageMetaDto({
        itemCount,
        pageOptionsDto,
      }),
    );
  }

  async getUser(userId: string): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder("user");

    queryBuilder.where("user.id = :userId", { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      this.logger.error(`User with id ${userId} not found`);
      throw new InternalServerErrorException();
    }

    return {
      ...userEntity,
    };
  }
}
