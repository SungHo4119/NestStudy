import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // postUser(
  //   @Body('nickname') nickname: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.usersService.createUser({
  //     nickname,
  //     email,
  //     password,
  //   });
  // }

  @Get()
  // @UseInterceptors(ClassSerializerInterceptor)
  /**
   * serialization -> 직렬화 -> 현재 시스템에서 사용되는 데이터의 구조를 다른 시스템에서도 쉽게 사용 할 수 있는 포맷으로 변환
   *                      -> Class의 object를 JSON으로 변환
   * deserialication -> 역직렬화
   *
   * ClassSerializerInterceptor의 경우 전역적으로 사용되어야 하는 경우가 많기 때문에 app 모듈의 providers에 설정
   */
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
