import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { PostsModule } from 'src/posts/posts.module';
import { User } from 'src/users/decorator/user.decorator';
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
  getPost(@Param('id', ParseIntPipe) id: number): Promise<PostsModule> {
    return this.postsService.getPostById(id);
  }
  /**
   * Post /posts
   * 포스트를 생성하는 API
   */
  @Post()
  @UseGuards(AccessTokenGuard)
  postPost(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    // @Body('title') title: string,
    // @Body('content') content: string,
  ): Promise<PostsModule> {
    const authorId = userId;
    return this.postsService.createPost(authorId, body);
  }

  /**
   * Patch /posts/:id
   * 포스트를 수정하는 API
   */
  @Patch(':id')
  PatchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ): Promise<PostsModule> {
    return this.postsService.updatePost(id, body);
  }

  /**
   * Delete /posts/:id
   * 포스트를 삭제하는 API
   */

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.postsService.deletePost(id);
  }
}
