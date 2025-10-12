import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ENV_DB_HOST,
  ENV_DB_PASSWORD,
  ENV_DB_PORT,
  ENV_DB_USERNAME,
} from 'src/common/const/env-keys.const';
import { PUBLIC_FOLDER_PATH } from 'src/common/const/path.const';
import { ImageModel } from 'src/common/entity/image.entity';
import { LogMiddleware } from 'src/common/middleware/log.middleware';
import { PostsModel } from 'src/posts/entity/post.entity';
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
    //@nestjs/config 설치시
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public',
    }),
    // TypeORM 테스트를 위한 모델
    TypeOrmModule.forFeature([]),
    // TypeOrmModule @nestjs/typeorm
    // forRoot는 TypeORM - DB연결을 사용할때 사용
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(ENV_DB_HOST),
        port: configService.get<number>(ENV_DB_PORT),
        username: configService.get<string>(ENV_DB_USERNAME),
        password: configService.get<string>(ENV_DB_PASSWORD),
        entities: [PostsModel, UsersModel, ImageModel],
        // 개발시 true - 동기화 옵션(entities에 따라 테이블 바뀜)
        synchronize: true,
      }),
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
// 모든 요청에 대해 LogMiddleware가 실행되도록 설정
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
