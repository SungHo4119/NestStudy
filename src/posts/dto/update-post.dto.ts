import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString({
    message: stringValidationMessage,
  })
  @IsOptional()
  title?: string;

  @IsString({
    message: stringValidationMessage,
  })
  @IsOptional()
  content?: string;
}
