import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import {
  ENV_HASH_ROUNDS,
  ENV_JWT_ACCESS_EXPIRATION,
  ENV_JWT_REFRESH_EXPIRATION,
} from 'src/common/const/env-keys.const';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * 토큰을 사용하게 되는 방식
   *
   * 1) 사용자가 로그인 또는 회원가입을 진행하면 accsessToken과 refreshToekn을 발급받는다.
   * 2) 로그인 할 때는 Basic 토큰과 함께 요청을 보낸다. Basic 토큰은 '이메일:비밀번호'를 인코딩 한 상태이다.
   *   - 예) {authorization: 'Basic <BasicToken>'}
   * 3) 아무나 접근 할 수 없는 정보( private route)를 접근 할떄는 accessToken을 Header에 추가해서 요청과 함께 보낸다.
   *   - 예) {authorization: 'Bearer <accessToken>'}
   * 4) 토큰 요청을 함께 받은 서버는 토큰 검증을 통해 현재 요청을 보낸 사용자가 누구인지 알 수 있다.
   *   - 예를들어서 현재 로그인한 사용자가 작성한 포스트만 가져오려면 토큰의  sub 값에 입력돼 있는 사용자의 포스트만 따로 필터링 할 수 있다.
   *   - 특정 사용자의 토큰이 없다면 다른 사용자의 데이터를 접근 못한다.
   *
   * 5) 모든 토큰은 만료 기간이 있다. 만료기간이 지나면 새로 토큰을 발급받아야한다.
   *   - 그렇지 않으면 jwtService.verify()에서 인증이 통과 안된다.
   *   - refresh 토큰을 새로 발급 받을 수 있는 /auth/token/refresh가 필요하다
   *   - access 토큰이 만료되면 새로 발급 받을 수 있는 /auth/token/access가 필요하다
   */
  /**
   * Header로 부터 토큰을 받을 때 토큰 형식
   * 1) Basic 토큰
   *   - 예) {authorization: 'Basic <BasicToken>'}
   * 2) Bearer 토큰
   *   - 예) {authorization: 'Bearer <accessToken>'}
   * 3) 토큰 형식
   *   - 예) {authorization: 'Bearer <accessToken>'}
   * 1~3을 파싱하는 메서드 필요
   */
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    if (splitToken.length !== 2 || splitToken[0] !== prefix) {
      throw new UnauthorizedException(
        '잘못된 유형의 토큰입니다.잘못된 유형의 토큰입니다.',
      );
    }

    const token = splitToken[1];

    return token;
  }

  /**
   * Basic 토큰을 디코딩하는 메서드
   * 1) 토큰을 email:password 형식으로 디코딩
   * 2) email:password를 [email, password] 형식으로 반환
   * 3) return { eamil, password }
   */
  decodeBasicToken(base64String: string) {
    const decode = Buffer.from(base64String, 'base64').toString('utf-8');

    const split = decode.split(':');

    if (split.length !== 2) {
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');
    }

    return { email: split[0], password: split[1] };
  }

  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
        // ignoreExpiration: false, // 만료된 토큰은 검증하지 않음
      });
    } catch {
      throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다.');
    }
  }

  rotateToken(token: string, isRefreshToken: boolean) {
    const decode = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    /**
     * sub: id
     * email: email
     * type: access | refresh
     */
    if (decode.type !== 'refresh') {
      throw new UnauthorizedException(
        '토큰 재발급은 refresh 토큰만 가능합니다.',
      );
    }

    return this.signToken({ ...decode }, isRefreshToken);
  }

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
  signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    return this.jwtService.sign(payload, {
      expiresIn: isRefreshToken
        ? this.configService.get<number>(ENV_JWT_REFRESH_EXPIRATION)
        : this.configService.get<number>(ENV_JWT_ACCESS_EXPIRATION),
    });
  }

  loginUser(user: Pick<UsersModel, 'email' | 'id'>) {
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

  async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEmailAndPassword(
      user.email,
      user.password,
    );

    return this.loginUser(existingUser);
  }

  async registerWithEmail(
    // user: Pick<UsersModel, 'nickname' | 'email' | 'password'>,
    user: RegisterUserDto,
  ) {
    const hash = await bcrypt.hash(
      user.password,
      parseInt(this.configService.get(ENV_HASH_ROUNDS).toString()),
    );

    const newUser = await this.usersService.createUser({
      ...user,
      password: hash,
    });

    return this.loginUser(newUser);
  }
}
