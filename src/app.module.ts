import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { WinstonModule } from "nest-winston";
import winstonConfig from "src/config/winston";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "./shared/services/shared.module";
import { ApiConfigService } from "./shared/services/api-config.service";
import { ConfigModule } from "@nestjs/config";
import { CourseModule } from "./modules/admin/course/course.module";
import { CourseCategoryModule } from "./modules/admin/course-category/course-category.module";
import { SampleModule } from "./modules/admin/sample/sample.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { ExcuteModule } from "./modules/execute/execute.module";
import { HealthModule } from "./modules/health/health.module";
import { UploadModule } from "./modules/upload/upload.module";
import { LessonModule } from "./modules/admin/lesson/lesson.module";

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
      envFilePath: process.env.NODE_ENV ? process.env.NODE_ENV : ".env.dev",
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    WinstonModule.forRoot(winstonConfig),
    ExcuteModule,
    LessonModule,
    CourseModule,
    CourseCategoryModule,
    SampleModule,
    AuthModule,
    UserModule,
    HealthModule,
    UploadModule,
  ],
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: I18nExceptionFilterPipe,
  //   },
  // ],
})
export class AppModule {}
