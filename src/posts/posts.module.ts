import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { PostsModel } from 'src/posts/entities/post.entity';

import { UsersModule } from 'src/users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    // forFeature: 모델에 해당하는 레포지토리를 주입할 때 사용 ( Entity 클래스 )
    TypeOrmModule.forFeature([PostsModel]),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  // Module에 Controller를 등록하면 Path가 NestJS에 등록되어 요청을 전달 받을 수있음
  controllers: [PostsController],
  // PostsController에서 주입받을 클래스를 providers에 작성한다. ( 인스턴스화 하지 않고 사용 가능하다. )
  // 인스턴스의 생성과 주입 등은 NestJS의 IoC Container에 의존하며 사용한다.
  providers: [PostsService],
})
export class PostsModule {}
