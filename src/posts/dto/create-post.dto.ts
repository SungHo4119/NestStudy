import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { PostsModel } from 'src/posts/entity/post.entity';

// Pick, Omit, Partial -> Type을 반환
// PickType, OmitType, PartialType -> 값을 반환
// Pick<PostsModel, 'title' | 'content'> => PickType(PostsModel, ['title', 'content'])
export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
  @IsString({
    // 배열을 검증해야하는 경우 each: true
    each: true,
    message: stringValidationMessage,
  })
  @IsOptional()
  images: string[] = [];
}
