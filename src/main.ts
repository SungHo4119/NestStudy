import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// nextjs를 시작하는 파일
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // useGlobalPipes: NestJS 프로젝트 전반적으로 사용할 Pipes
  // new ValidationPipe() - Class validator를 사용하기 위해 적용 ( class validator, class transformer )
  // app.useGlobalPipes(new ValidationPipe());
  // => app.module.ts의 providers에 설정

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
