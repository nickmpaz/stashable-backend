import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Configuration } from 'src/config/configuration';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'debug'] });
  const configService = app.get(ConfigService);
  const config = configService.get<Configuration>('config');
  app.enableCors();
  await app.listen(config.app.port);
}
bootstrap();
