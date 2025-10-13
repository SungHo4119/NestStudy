import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { QueryRunnerTS } from 'src/common/decorator/query-runner.decorator';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { RolesEnum } from 'src/users/const/roles.const';
import { Roles } from 'src/users/decorator/roles.decorator';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { QueryRunner } from 'typeorm';
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
  @Roles(RolesEnum.ADMIN)
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

  @Get('follow')
  async getFollow(
    @User() user: UsersModel,
    @Query('includeConfirmed', new DefaultValuePipe(true), ParseBoolPipe)
    includeConfirmed,
  ) {
    return this.usersService.getFollowers(user.id, includeConfirmed);
  }

  @Post('follow/:followeeId')
  async postFollow(
    @User() user: UsersModel,
    @Param('followeeId', ParseIntPipe) followeeId: number,
  ) {
    return this.usersService.followUser(user.id, followeeId);
  }

  @Patch('follow/:followerId/confirm')
  @UseInterceptors(TransactionInterceptor)
  async patchFollowConfim(
    @User() user: UsersModel,
    @Param('followerId', ParseIntPipe) followerId: number,
    @QueryRunnerTS() qr: QueryRunner,
  ) {
    await this.usersService.confirmFollow(followerId, user.id, qr);
    await this.usersService.incrementFollowerCount(user.id, qr);
    return true;
  }

  @Delete('follow/:followeeId')
  async deleteFollow(
    @User() user: UsersModel,
    @Param('followeeId', ParseIntPipe) followeeId: number,
    @QueryRunnerTS() qr: QueryRunner,
  ) {
    await this.usersService.deleteFollow(user.id, followeeId, qr);
    await this.usersService.decrementFollowerCount(user.id, qr);
    return true;
  }
}
