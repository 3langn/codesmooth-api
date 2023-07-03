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

async function bootstrap() {
  // initializeTransactionalContext();
  // patchTypeORMRepositoryWithBaseRepository();

  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.setGlobalPrefix("/api");

  app.use(helmet());

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
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  const port = configService.appConfig.port;

  await app.listen(port, "0.0.0.0");
  console.info(`Server running on port ${port} 👍`);
}
bootstrap();
