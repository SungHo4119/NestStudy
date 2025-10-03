import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HOST, PORT, PROTOCOL } from 'src/common/const/env.const';
import { OrderBy, PaginationID } from 'src/common/type/pagination.type';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PaginatePostsDto } from 'src/posts/dto/paginate-post.dto';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { PostsModel } from 'src/posts/entities/post.entity';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
// Injectable: 주입 할 수 있다.
// module에 사용하기 위해서는 @Injectable()을 작성 해 주어야한다.
@Injectable()
export class PostsService {
  constructor(
    // @nestjs/typeorm
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
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
    if (dto.page) {
      return this.pagePaginatePosts(dto);
    }
    return this.cursorPaginatePosts(dto);
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

  async cursorPaginatePosts(dto: PaginatePostsDto) {
    const where: FindOptionsWhere<PostsModel> = {};

    if (dto.where__id_more_then) {
      where.id = MoreThan(dto.where__id_more_then);
    } else if (dto.where__id_less_then) {
      where.id = LessThan(dto.where__id_less_then);
    }

    const posts = await this.postsRepository.find({
      where: where,
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    const lastItem =
      posts.length > 0 && posts.length === dto.take
        ? posts[posts.length - 1]
        : null;

    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}:${PORT}/posts`);
    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (
          key !== (PaginationID.MORE_THAN as string) &&
          key !== (PaginationID.LESS_THAN as string)
        ) {
          nextUrl.searchParams.append(key, dto[key]);
        }
      }

      const key =
        dto.order__createdAt === OrderBy.ASC
          ? PaginationID.MORE_THAN
          : PaginationID.LESS_THAN;
      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: posts,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: posts.length,
      next: nextUrl?.toString() ?? null,
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
