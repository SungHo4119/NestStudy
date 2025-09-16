import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';
// Injectable: 주입 할 수 있다.
// module에 사용하기 위해서는 @Injectable()을 작성 해 주어야한다.
@Injectable()
export class PostsService {
  constructor(
    // @nestjs/typeorm
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts(): Promise<PostsModel[]> {
    const posts = await this.postsRepository.find({
      relations: ['author'],
    });
    return posts;
  }

  async getPostById(id: number): Promise<PostsModel> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      // NotFoundException - NestJS에서 기본으로 제공하는 에러 타입
      throw new NotFoundException();
    }

    return post;
  }

  async createPost(
    authorId: number,
    title: string,
    content: string,
  ): Promise<PostsModel> {
    const post: PostsModel = this.postsRepository.create({
      author: {
        id: authorId,
      },
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });

    // save의 기능
    // 1) id값이 같은 데이터가(혹은 id값이 없는경우) 존재하지 않는다면 새로 생성한다.
    // 2) id값이 존재하고 같은 id값을 가진 데이터가 존재한다면 객체를 저장한다.
    const newPost = await this.postsRepository.save(post);
    return newPost;
  }

  async updatePost(
    id: number,
    title?: string,
    content?: string,
  ): Promise<PostsModel> {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(id: number): Promise<number> {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });
    if (!post) {
      throw new NotFoundException();
    }

    await this.postsRepository.delete(id);

    return id;
  }
}
