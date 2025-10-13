import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class PostExistsMiddleware implements NestMiddleware {
  constructor(private readonly postService: PostsService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const postId = req.params.postId;

    if (!postId) {
      throw new BadRequestException(`Post Id는 필수입니다.`);
    }

    const exists = await this.postService.checkPostExistsById(+postId);

    if (!exists) {
      throw new BadRequestException(
        `Post Id ${postId}에 해당하는 Post가 존재하지 않습니다.`,
      );
    }
    next();
  }
}
