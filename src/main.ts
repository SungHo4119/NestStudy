import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// nextjs를 시작하는 파일
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
