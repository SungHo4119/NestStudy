import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from 'src/posts/entities/post.entity';

// Pick, Omit, Partial -> Type을 반환
// PickType, OmitType, PartialType -> 값을 반환
// Pick<PostsModel, 'title' | 'content'> => PickType(PostsModel, ['title', 'content'])
export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {}
