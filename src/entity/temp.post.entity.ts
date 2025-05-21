import { TempTagModel } from 'src/entity/temp.tag.entity';
import { TempUserModel } from 'src/entity/temp.user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'temp_post' })
export class TempPostModel {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * ManyToOne으로 선언 될 경우 JoinColumn이 필요없다.
   */
  @ManyToOne(() => TempUserModel, (user) => user.posts)
  author: TempUserModel;

  @ManyToMany(() => TempTagModel, (tag) => tag.posts)
  @JoinTable()
  tags: TempTagModel[];

  @Column()
  title: string;
}
