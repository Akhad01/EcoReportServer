import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');

  const uploadsPath = path.join(process.cwd(), 'uploads');
  fs.mkdirSync(uploadsPath, { recursive: true });
  app.useStaticAssets(uploadsPath, { prefix: '/uploads' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
