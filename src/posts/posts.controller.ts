import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsModule } from 'src/posts/posts.module';
import { PostsService } from './posts.service';

// nest g resource 를 이용해서 모듈을 생성 할 수 있다.

@Controller('posts')
export class PostsController {
  // postsService의 객체는 NestJS의 IoC Container에서 가져온다.
  constructor(private readonly postsService: PostsService) {}

  /**
   * GET /posts
   * 모든 포스트를 가져오는 API
   */
  @Get('')
  getPosts(): Promise<PostsModule[]> {
    return this.postsService.getAllPosts();
  }

  /**
   * GET /posts/:id
   * 특정 포스트를 가져오는 API
   */
  @Get(':id')
  getPost(@Param('id') id: number): Promise<PostsModule> {
    return this.postsService.getPostById(+id);
  }
  /**
   * Post /posts
   * 포스트를 생성하는 API
   */
  @Post()
  cpostPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<PostsModule> {
    return this.postsService.createPost(author, title, content);
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
  ): Promise<PostsModule> {
    return this.postsService.updatePost(+id, author, title, content);
  }

  /**
   * Delete /posts/:id
   * 포스트를 삭제하는 API
   */

  @Delete(':id')
  deletePost(@Param('id') id: string): Promise<number> {
    return this.postsService.deletePost(+id);
  }
}
