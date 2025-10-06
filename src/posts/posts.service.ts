import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PaginatePostsDto } from 'src/posts/dto/paginate-post.dto';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
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
    private readonly commonService: CommonService,
  ) {}

  /**
   *
   * @param dto: PaginatePostsDto
   * @returns {
   * data: Data[],
   * cursor: {
   *  after: 마지막 data의 id
   * }
   * count: 이번 요청에서 가져온 데이터의 수
   * next: 다음요청을 할 때 사용할 URL
   * }
   *
   */

  async paginatePosts(dto: PaginatePostsDto) {
    // if (dto.page) {
    //   return this.pagePaginatePosts(dto);
    // }
    // return this.cursorPaginatePosts(dto);
    return this.commonService.paginate(
      dto,
      this.postsRepository,
      {
        relations: ['author'],
      },
      'posts',
    );
  }

  async pagePaginatePosts(dto: PaginatePostsDto) {
    const [posts, total] = await this.postsRepository.findAndCount({
      skip: ((dto.page ?? 1) - 1) * dto.take,
      take: dto.take,
      order: {
        createdAt: dto.order__createdAt,
      },
    });
    return {
      data: posts,
      count: total,
    };
  }

  async generatePost(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `Post ${i}`,
        content: `Content for post ${i}`,
      });
    }
  }

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
    postDto: CreatePostDto,
  ): Promise<PostsModel> {
    const post: PostsModel = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    // save의 기능
    // 1) id값이 같은 데이터가(혹은 id값이 없는경우) 존재하지 않는다면 새로 생성한다.
    // 2) id값이 존재하고 같은 id값을 가진 데이터가 존재한다면 객체를 저장한다.
    const newPost = await this.postsRepository.save(post);
    return newPost;
  }

  async updatePost(id: number, postDto: UpdatePostDto): Promise<PostsModel> {
    const { title, content } = postDto;

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
