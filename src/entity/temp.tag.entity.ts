import { TempPostModel } from 'src/entity/temp.post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'temp_tag' })
export class TempTagModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => TempPostModel, (post) => post.tags)
  posts: TempPostModel[];

  @Column()
  name: string;
}
