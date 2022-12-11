import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { WinstonModule } from "nest-winston";
import { AcceptLanguageResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import * as path from "path";
import { I18nExceptionFilterPipe } from "./common/pipe/i18n-exception-filter.pipe";
import winstonConfig from "src/config/winston";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "./shared/services/shared.module";
import { ApiConfigService } from "./shared/services/api-config.service";
import { ConfigModule } from "@nestjs/config";
import { ExcuteController } from "./modules/excute.controller";
import { ExcuteModule } from "./modules/excute.module";
import { LessionModule } from "./modules/admin/lession/lession.module";
import { CourseModule } from "./modules/admin/course/course.module";
import { CourseCategoryModule } from "./modules/admin/course-category/course-category.module";
import { SampleModule } from "./modules/admin/sample/sample.module";

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
    LessionModule,
    CourseModule,
    CourseCategoryModule,
    SampleModule,
  ],
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: I18nExceptionFilterPipe,
  //   },
  // ],
})
export class AppModule {}
