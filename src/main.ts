import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { envConfig } from '@main/config/env.config';
import { AllExceptionsFilter } from '@main/errors/all-exception.filter';
import { AppModule } from '@main/modules/_global/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(envConfig.application.port, () => {
    Logger.log(
      `✅ OK ${envConfig.application.name} system is running on port ${envConfig.application.port} in ${envConfig.application.nodeEnv} mode.`,
    );
  });
}
bootstrap();
