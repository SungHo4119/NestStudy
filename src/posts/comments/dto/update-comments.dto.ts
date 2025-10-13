import { PartialType } from '@nestjs/mapped-types';
import { CreatePostCommentDto } from 'src/posts/comments/dto/create-commentf.dto';

export class UpdateCommentsDto extends PartialType(CreatePostCommentDto) {}
