import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { BasicTokenGuard } from 'src/auth/guard/basic-token.guard';
import { RefreshTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  postAccessToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, false);
    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  postRefreshToken(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    const newToken = this.authService.rotateToken(token, true);
    return {
      refreshToken: newToken,
    };
  }

  @Post('login/email')
  @IsPublic()
  @UseGuards(BasicTokenGuard)
  postLoginEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  @IsPublic()
  postRegisterEmail(
    // @Body('nickname') nickname: string,
    // @Body('email') email: string,
    // @Body('password', new MaxLengthPipe(20), new MinLengthPipe(4))
    // password: string,
    // @Body('password', PasswordPipe) password: string,
    @Body() body: RegisterUserDto,
  ) {
    return this.authService.registerWithEmail(body);
  }
}
