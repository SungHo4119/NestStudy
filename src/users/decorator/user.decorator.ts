import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersModel } from 'src/users/entities/users.entity';

export const User = createParamDecorator(
  (data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user as UsersModel;

    if (!user) {
      throw new InternalServerErrorException(
        'Request에 User 프로퍼티가 존재하지 않습니다!',
      );
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
