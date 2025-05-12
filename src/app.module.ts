import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

// NestJS의 모듈을 정의하는 파일 ( 의존성 정의 )
@Module({
  // 다른 모듈을 불러올 때 사용
  imports: [PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
// AppModule로 부터 모듈의 확장( import )를 하고
// main.ts의 NestFactory.create(AppMoudule); 에서 서버를 실행
export class AppModule {}
