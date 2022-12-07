import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import helmet from "helmet";
import * as morgan from "morgan";
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
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000,
  //     max: 100,
  //   }),
  // );

  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new HTTPLogger(),
  );
  app.use(compression());

  // const configService = app.select(SharedModule).get(ApiConfigService);

  const port = 3001;
  // const port = configService.appConfig.port;

  await app.listen(port);
  console.info(`Server running on port ${port} 👍`);
}
bootstrap();
