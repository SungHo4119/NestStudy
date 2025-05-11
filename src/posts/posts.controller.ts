import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

// nest g resource 를 이용해서 모듈을 생성 할 수 있다.
/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */
interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'newJeans_Official',
    title: '뉴진스 민지',
    content: '메이크업 고치고 있는 민지',
    likeCount: 100000,
    commentCount: 5000000,
  },
  {
    id: 2,
    author: 'newJeans_Official',
    title: '뉴진스 해린',
    content: '노래 연습 하고 있는 해린',
    likeCount: 9999,
    commentCount: 49999,
  },
  {
    id: 3,
    author: 'newJeans_Official',
    title: '뉴진스 로제',
    content: '운동중인 로제',
    likeCount: 8888,
    commentCount: 399999,
  },
];

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * GET /posts
   * 모든 포스트를 가져오는 API
   */
  @Get('')
  getPosts(): PostModel[] {
    return posts;
  }

  /**
   * GET /posts/:id
   * 특정 포스트를 가져오는 API
   */
  @Get(':id')
  getPost(@Param('id') id: number) {
    const post = posts.find((post) => post.id === +id);
    if (!post) {
      // NotFoundException - NestJS에서 기본으로 제공하는 에러 타입
      throw new NotFoundException();
    }

    return post;
  }
  /**
   * Post /posts
   * 포스트를 생성하는 API
   */
  @Post()
  postPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author: author,
      title: title,
      content: content,
      likeCount: 0,
      commentCount: 0,
    };
    posts = [...posts, post];
    return post;
  }

  /**
   * Put /posts/:id
   * 포스트를 수정하는 API
   */
  @Put(':id')
  putPost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    const post: PostModel | undefined = posts.find((post) => post.id === +id);
    if (!post) {
      throw new NotFoundException();
    }

    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    posts = posts.map((prvePost: PostModel) =>
      prvePost.id === +id ? post : prvePost,
    );

    return post;
  }

  /**
   * Delete /posts/:id
   * 포스트를 삭제하는 API
   */

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    const post: PostModel | undefined = posts.find((post) => post.id === +id);
    if (!post) {
      throw new NotFoundException();
    }

    posts = posts.filter((post) => post.id !== +id);

    return id;
  }
}
