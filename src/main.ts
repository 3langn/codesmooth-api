import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import * as compression from "compression";

import { AppModule } from "./app.module";
import { SharedModule } from "./shared/services/shared.module";
import { ApiConfigService } from "./shared/services/api-config.service";
import { HTTPLogger } from "./common/interceptor/logger";
import { CustomHttpException } from "./common/exception/custom-http.exception";
import { StatusCodesList } from "./common/constants/status-codes-list.constants";

async function bootstrap() {
  // initializeTransactionalContext();
  // patchTypeORMRepositoryWithBaseRepository();
  // all domains have vnpayment.vn as origin
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: ["http://localhost:3000", "https://*-codesmooth.netlify.app", "*.vnpayment.vn"],
    },
  });
  app.use(helmet());
  app.setGlobalPrefix("/api");

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10000,
    }),
  );

  // app.useGlobalPipes(new ValidationPipe());

  app.use(compression());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new HTTPLogger());

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => {
        console.log(errors);

        const msg = Object.keys(errors[0].constraints).map((key) => errors[0].constraints[key])[0];

        return new CustomHttpException({
          message: msg,
          code: StatusCodesList.ValidationError,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      },
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  const port = configService.appConfig.port;

  await app.listen(port, "0.0.0.0");
  console.info(`Server running on port ${port} 👍`);
}
bootstrap();
