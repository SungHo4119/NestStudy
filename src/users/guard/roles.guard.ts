import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/users/decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    /**
     * Roles annotation에 대한 metadata를 가져와야한다.
     *
     * Reflector를 이용하여 metadata를 가져올 수 있다. ( getALLAndOverride)
     */
    const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Roles 데코레이터가 없는경우 통과
    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new UnauthorizedException('토큰을 제공 해주세요.');
    }

    if (user.role !== requiredRole) {
      throw new ForbiddenException(
        `이 작업을 수행할 권한이 없습니다. ${requiredRole}이 필요합니다.`,
      );
    }
    return true;
  }
}
