import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWT_ACCESS_EXPIRATION, JWT_SECRET } from './const/auth.const';

@Module({
  imports: [
    // JWT 모듈 등록
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_ACCESS_EXPIRATION },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
