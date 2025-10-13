import { PickType } from '@nestjs/mapped-types';
import { CommentsModel } from 'src/posts/comments/entity/comment.entity';

export class CreatePostCommentDto extends PickType(CommentsModel, [
  'comment',
]) {}
