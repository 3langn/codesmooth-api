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
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.setGlobalPrefix("/api");

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10000,
    }),
  );

  app.use(compression());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)), new HTTPLogger());

  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      whitelist: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => {
        function getErrorMsg(errors) {
          if (errors.constraints) {
            return Object.keys(errors.constraints).map((key) => errors.constraints[key])[0];
          } else if (errors.children && errors.children.length > 0) {
            return getErrorMsg(errors.children[0]);
          } else {
            return "Validation failed";
          }
        }

        let msg = getErrorMsg(errors[0]);
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
