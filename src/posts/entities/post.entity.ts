import { BaseModel } from 'src/common/entity/base.entity';
import { UserModel } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class PostModel extends BaseModel {
  // 1) UserModel과 연결한다. ForeignKey를 이용해서
  // 2) null이 될 수 없다.
  @ManyToOne(() => UserModel, (user) => user.posts)
  author: UserModel;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
