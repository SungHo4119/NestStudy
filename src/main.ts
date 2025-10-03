import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// nextjs를 시작하는 파일
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // useGlobalPipes: NestJS 프로젝트 전반적으로 사용할 Pipes
  // new ValidationPipe() - Class validator를 사용하기 위해 적용 ( class validator, class transformer )
  // dto에서 변환하는 작업(초기값을 넣기 위해 transform 옵션을 true로 설정)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        // DTO에서 @Type(() => Number)와 같은 데코레이터를 사용하지 않아도 자동으로 하위에 적용된 IsNumber, IsString 등의 데코레이터를 보고 형변환을 수행
        enableImplicitConversion: true,
      },
    }),
  );
  // app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
