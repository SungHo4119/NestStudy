import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { ChatsModel } from 'src/chats/entity/chat.entity';
import { MessagesModel } from 'src/chats/messages/entity/messages.entity';
import { BaseModel } from 'src/common/entity/base.entity';
import { emailValidationMessage } from 'src/common/validation-message/email-validation.message';
import { lengthValidationMessage } from 'src/common/validation-message/length-validation.message';
import { stringValidationMessage } from 'src/common/validation-message/string-validation.message';
import { CommentsModel } from 'src/posts/comments/entity/comment.entity';
import { PostsModel } from 'src/posts/entity/post.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { RolesEnum } from '../const/roles.const';

@Entity()
@Unique(['email'])
@Unique(['nickname'])
// @Exclude()
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
  /**
   * Request
   * fronted -> backend
   * plain object (JSON) -> class instance (DTO)
   *
   * Response
   * backend -> frontend
   * class instance (DTO) -> plain object (JSON)
   *
   * toClassOnly -> class instance로 변환 될 때만
   * toPlainOnly -> plain object로 변환 될 때만
   */
  @Exclude({
    // 응답에서만 제외하기 위해 사용
    toPlainOnly: true,
  })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];

  // @Expose()
  // get nickNameAndEmail() {
  //   return this.nickname + '/' + this.email;
  // }

  @ManyToMany(() => ChatsModel, (chat) => chat.users)
  @JoinTable()
  chats: ChatsModel[];

  @ManyToOne(() => MessagesModel, (message) => message.author)
  messages: MessagesModel[];

  @OneToMany(() => CommentsModel, (comment) => comment.author)
  postComments: CommentsModel[];
}
