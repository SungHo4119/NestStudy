import { BadRequestException, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { PostsModel } from 'src/posts/entities/post.entity';

import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { extname } from 'path';
import { POST_IMAGE_PATH } from 'src/common/const/path.const';
import { UsersModule } from 'src/users/users.module';
import { v4 as uuid } from 'uuid';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    // forFeature: 모델에 해당하는 레포지토리를 주입할 때 사용 ( Entity 클래스 )
    TypeOrmModule.forFeature([PostsModel]),
    AuthModule,
    UsersModule,
    CommonModule,
    MulterModule.register({
      limits: {
        fileSize: 1000000,
      },
      fileFilter: (req, file, cb) => {
        /**
         * cb
         *
         * 첫번째 파라미터에는 에러가 있을 경우 에러 정보를 넣어준다.
         * 두번째 파라미터는 파일으 받을지 말지 boolean을 넣어준다.
         */
        // xxx.jpg -> .jpg
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다!'),
            false,
          );
        }
        return cb(null, true);
      },
      storage: multer.diskStorage({
        // 파일을 다운로드 하였을 때 어디로 넣을지
        destination: function (req, res, cb) {
          cb(null, POST_IMAGE_PATH);
        },
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  // Module에 Controller를 등록하면 Path가 NestJS에 등록되어 요청을 전달 받을 수있음
  controllers: [PostsController],
  // PostsController에서 주입받을 클래스를 providers에 작성한다. ( 인스턴스화 하지 않고 사용 가능하다. )
  // 인스턴스의 생성과 주입 등은 NestJS의 IoC Container에 의존하며 사용한다.
  providers: [PostsService],
})
export class PostsModule {}
