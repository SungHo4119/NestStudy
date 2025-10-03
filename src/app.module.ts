import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from 'src/posts/entities/post.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { PostsModule } from './posts/posts.module';
import { UsersModel } from './users/entities/users.entity';
import { UsersModule } from './users/users.module';

// NestJS의 모듈을 정의하는 파일 ( 의존성 정의 )
@Module({
  // 다른 모듈을 불러올 때 사용
  imports: [
    // TypeORM 테스트를 위한 모델
    TypeOrmModule.forFeature([]),
    // TypeOrmModule @nestjs/typeorm
    // forRoot는 TypeORM - DB연결을 사용할때 사용
    TypeOrmModule.forRoot({
      // 데이터 베이스 타입
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      entities: [PostsModel, UsersModel],
      // 개발시 true - 동기화 옵션(entities에 따라 테이블 바뀜)
      synchronize: true,
    }),
    PostsModule,
    UsersModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
// AppModule로 부터 모듈의 확장( import )를 하고
// main.ts의 NestFactory.create(AppMoudule); 에서 서버를 실행
export class AppModule {}
