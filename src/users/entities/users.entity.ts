import { BaseModel } from 'src/common/entity/base.entity';
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
  nickname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];
}
