import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';
import { RolesEnum } from 'src/users/const/roles.const';

@Injectable()
export class IsPostMineOrAdminGuard implements CanActivate {
  constructor(private readonly postService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user } = req;

    if (!user) {
      throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
    }

    // admin인 경우 pass
    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    const postId = req.params.postId;

    if (!postId) {
      throw new BadRequestException('Post ID가 파라미터로 제공되어야 합니다.');
    }

    const isOk = await this.postService.isPostMine(user.id, parseInt(postId));
    if (!isOk) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true;
  }
}
