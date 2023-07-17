import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { WinstonModule } from "nest-winston";
import winstonConfig from "src/config/winston";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "./shared/services/shared.module";
import { ApiConfigService } from "./shared/services/api-config.service";
import { ConfigModule } from "@nestjs/config";
import { InstructorCourseModule } from "./modules/instructor/course/course.module";
import { SampleModule } from "./modules/instructor/sample/sample.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { ExcuteModule } from "./modules/execute/execute.module";
import { HealthModule } from "./modules/health/health.module";
import { UploadModule } from "./modules/upload/upload.module";
import { LessonModule } from "./modules/instructor/lesson/lesson.module";
import { CategoryModule } from "./modules/admin/category/category.module";
import { SectionModule } from "./modules/admin/section/section.module";
import { SettingModule } from "./modules/admin/setting/setting.module";
import { JwtModule } from "@nestjs/jwt";
import { MailerModule } from "./modules/mailer/mailer.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { TransactionModule } from "./modules/admin/transaction/transaction.module";
import { InstructorCategoryModule } from "./modules/category/category.module";
import { CourseModule } from "./modules/course/course.module";
import { AdminCourseModule } from "./modules/admin/course/course.module";
import { ScheduleModule } from "@nestjs/schedule";
import typeorm from "./config/typeorm";

@Module({
  imports: [
    // I18nModule.forRoot({
    //   fallbackLanguage: "en",
    //   loaderOptions: {
    //     path: path.join(__dirname, "/i18n/"),
    //     watch: true,
    //   },
    //   resolvers: [
    //     { use: QueryResolver, options: ["lang"] },
    //     AcceptLanguageResolver,
    //   ],
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ? process.env.NODE_ENV : "local"}`],
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: async (configService: ApiConfigService) => configService.getPostgresConfig(),
      inject: [ApiConfigService],
    }),

    WinstonModule.forRoot(winstonConfig),
    ScheduleModule.forRoot(),
    ExcuteModule,
    LessonModule,
    InstructorCourseModule,
    SectionModule,
    SampleModule,
    AuthModule,
    UserModule,
    HealthModule,
    UploadModule,
    CategoryModule,
    SettingModule,
    JwtModule,
    PaymentModule,
    MailerModule,
    TransactionModule,
    InstructorCategoryModule,
    InstructorCourseModule,
    CourseModule,
    AdminCourseModule,
  ],
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: I18nExceptionFilterPipe,
  //   },
  // ],
})
export class AppModule {}
