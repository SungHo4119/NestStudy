import { IsEmail, IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { PostsModel } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { RolesEnum } from '../const/roles.const';

@Entity()
@Unique(['email'])
@Unique(['nickname'])
export class UsersModel extends BaseModel {
  @Column({
    length: 20,
  })
  @IsString({ message: stringValidationMessage })
  @Length(1, 20, { message: lengthValidationMessage })
  nickname: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(3, 20, { message: lengthValidationMessage })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}
