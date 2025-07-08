import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  HASH_ROUNDS,
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
} from 'src/auth/const/auth.const';
import { UserModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  /**
   * 만드려는 기능
   * 1) registerWithEmail
   *   - email, nickname, password를 입력 받고 사용자를 생성한다.
   *   - 생성이 완료되면 accessToken과 refreshToken을 반환한다.
   *     - 회원가입 후 다시 로그인해주세요 <- 쓸모없는 과정 방지 ( 회원가입 후 로그인 진행 프로세스 X)
   *
   * 2) loginWithEmail
   *   - email, password를 입력 받고 사용자 검증을 진행한다.
   *   - 검증이 완료되면 accessToken과 refreshToken을 반환한다.
   *
   * 3) loginUser
   *   - (1)과 (2)에서 필요한 accessToken과 refreshToken을 반환하는 로직
   *
   * 4) signToken
   *   - (3)에서 필요한 accessToken과 refreshToken을 sign하는 로직
   *
   * 5) authenticateWithEmailAndPassword
   *   - (2)로그인 을 진행할 때 필요한 기본적인 검증 진행
   *   1. 사용자가 존재하는지 확인 (email)
   *   2. 비밀번호가 일치하는지 확인
   *   3. 모두 통과되면 찾은 사용자 정보 반환
   *   4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
   */

  /**
   * Payload에 담길 정보
   * 1) email
   * 2) sub (사용자 ID)
   * 3) type: 'access' | 'refresh'
   */
  signToken(user: Pick<UserModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      expiresIn: isRefreshToken
        ? JWT_REFRESH_EXPIRATION
        : JWT_ACCESS_EXPIRATION,
    });
  }

  loginUser(user: Pick<UserModel, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }

  async authenticateWithEmailAndPassword(email: string, password: string) {
    /**
     *   1. 사용자가 존재하는지 확인 (email)
     *   2. 비밀번호가 일치하는지 확인
     *   3. 모두 통과되면 찾은 사용자 정보 반환
     *   4. loginWithEmail에서 반환된 데이터를 기반으로 토큰 생성
     */
    const existingUser = await this.usersService.getUserByEmail(email);

    if (!existingUser) {
      throw new UnauthorizedException('존재하지 않는 사용자 입니다.');
    }

    /**
     * 파라미터
     *
     * 1) 입력된 비밀번호
     * 2) 기존 해시 (hash) -> 사용자 정보에 저장되어 있는 hash
     */
    const passOk = await bcrypt.compare(password, existingUser.password);

    if (!passOk) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return existingUser;
  }

  async loginWithEmail(user: Pick<UserModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(
      user.email,
      user.password,
    );

    return this.loginUser(existingUser);
  }

  async registerWithEmail(
    user: Pick<UserModel, 'nickname' | 'email' | 'password'>,
  ) {
    const hash = await bcrypt.hash(user.password, HASH_ROUNDS);

    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }
}
