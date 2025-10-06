import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { JwtModule } from '@nestjs/jwt';
import {
  ENV_JWT_ACCESS_EXPIRATION,
  ENV_JWT_SECRET,
} from 'src/common/const/env-keys.const';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // JWT 모듈 등록
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // 환경변수에서 JWT_SECRET 가져오기
        secret: configService.get<string>(ENV_JWT_SECRET),
        signOptions: {
          // 환경변수에서 만료 시간 가져오기
          expiresIn: configService.get<string>(ENV_JWT_ACCESS_EXPIRATION),
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
