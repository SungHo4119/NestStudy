import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { QueryRunnerTS } from 'src/common/decorator/query-runner.decorator';
import { ImageModelType } from 'src/common/entity/image.entity';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PaginatePostsDto } from 'src/posts/dto/paginate-post.dto';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { PostsModel } from 'src/posts/entity/post.entity';
import { PostImagesService } from 'src/posts/image/images.service';
import { User } from 'src/users/decorator/user.decorator';
import { DataSource, QueryRunner } from 'typeorm';
import { PostsService } from './posts.service';

// nest g resource 를 이용해서 모듈을 생성 할 수 있다.

@Controller('posts')
export class PostsController {
  // postsService의 객체는 NestJS의 IoC Container에서 가져온다.
  constructor(
    private readonly postsService: PostsService,
    // nestJS에서 Inject해줌
    private readonly dataSource: DataSource,

    private readonly postImageService: PostImagesService,
  ) {}

  /**
   * GET /posts
   * 모든 포스트를 가져오는 API
   */
  @Get('')
  async getPosts(@Query() query: PaginatePostsDto) {
    // return this.postsService.getAllPosts();
    return await this.postsService.paginatePosts(query);
  }

  @Post('random')
  @UseGuards(AccessTokenGuard)
  async generatePosts(@User('id') userId: number): Promise<void> {
    await this.postsService.generatePost(userId);
  }

  /**
   * GET /posts/:id
   * 특정 포스트를 가져오는 API
   */
  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number): Promise<PostsModel> {
    return await this.postsService.getPostById(id);
  }
  /**
   * Post /posts
   * 포스트를 생성하는 API
   */
  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postPosts(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    @QueryRunnerTS() qr: QueryRunner,
    // @Body('title') title: string,
    // @Body('content') content: string,
  ) {
    const post = await this.postsService.createPost(userId, body, qr);

    for (let i = 0; i < body.images.length; i++) {
      await this.postImageService.createPostImage(
        {
          post,
          order: i,
          path: body.images[i],
          type: ImageModelType.POST_IMAGE,
        },
        qr,
      );
    }
    return this.postsService.getPostById(post.id, qr);
  }

  /**
   * Patch /posts/:id
   * 포스트를 수정하는 API
   */
  @Patch(':id')
  async patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ): Promise<PostsModel> {
    return await this.postsService.updatePost(id, body);
  }

  /**
   * Delete /posts/:id
   * 포스트를 삭제하는 API
   */

  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return await this.postsService.deletePost(id);
  }
}
