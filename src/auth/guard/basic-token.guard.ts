/**
 * 구현할 기능
 *
 * 1) 요청객체 (request)를 불러오고 authorization header로 부터 토큰을 가져온다.
 * 2) authSerivce.extractTokenFromHeader 메서드를 사용하여 토큰을 추출한다.
 * 3) authService.decodeBasicToken 메서드를 사용하여 email과 password를 추출한다.
 * 4) email과 password를 사용하여 사용자를 가져온다
 * 5) 사용자 정보를 요청 객체에 붙여준다.
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다.');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const decodedToken = this.authService.decodeBasicToken(token);

    const { email, password } = decodedToken;

    const user = await this.authService.authenticateWithEmailAndPassword(
      email,
      password,
    );

    req.user = user;

    return true;
  }
}
