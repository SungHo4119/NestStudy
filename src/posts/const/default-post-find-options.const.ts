import { PostsModel } from 'src/posts/entity/post.entity';
import { FindManyOptions } from 'typeorm';

export const DEFAULT_POST_FIND_OPTIONS: FindManyOptions<PostsModel> = {
  relations: {
    author: true,
    images: true,
  },
};
