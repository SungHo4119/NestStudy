import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  // Module에 Controller를 등록하면 Path가 NestJS에 등록되어 요청을 전달 받을 수있음
  controllers: [PostsController],
  // PostsController에서 주입받을 클래스를 providers에 작성한다. ( 인스턴스화 하지 않고 사용 가능하다. )
  // 인스턴스의 생성과 주입 등은 NestJS의 IoC Container에 의존하며 사용한다.
  providers: [PostsService],
})
export class PostsModule {}
