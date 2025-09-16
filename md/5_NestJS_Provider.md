# Provider

Provider는 NestJS의 핵심 개념 중 하나로, **의존성 주입(Dependency Injection)**을 통해 관리되는 클래스입니다. Provider는 service, repository, factory, helper 등 다양한 형태로 사용될 수 있으며, `@Injectable()` 데코레이터로 표시됩니다.

## Provider의 특징

- **IoC Container**에 의해 인스턴스 생명주기가 관리됩니다
- 의존성 주입을 통해 다른 클래스에서 사용할 수 있습니다
- 모듈의 `providers` 배열에 등록되어야 합니다
- 기본적으로 **싱글톤 패턴**으로 동작합니다

---

## Controller

Controller는 **HTTP 요청을 처리하고 응답을 반환**하는 역할을 담당합니다. MVC 패턴에서 Controller 역할을 수행하며, 클라이언트의 요청을 받아 적절한 Service를 호출합니다.

### Controller의 주요 특징

- `@Controller()` 데코레이터로 정의
- HTTP 메서드 데코레이터 사용 (`@Get()`, `@Post()`, `@Put()`, `@Delete()` 등)
- 라우팅 경로 설정
- 요청 데이터 추출 (`@Param()`, `@Body()`, `@Query()` 등)

### 실제 예시 (PostsController)

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts') // 기본 경로: /posts
export class PostsController {
  // 의존성 주입: PostsService를 생성자에서 주입받음
  constructor(private readonly postsService: PostsService) {}

  /**
   * GET /posts - 모든 포스트 조회
   */
  @Get()
  getPosts() {
    return this.postsService.getAllPosts();
  }

  /**
   * GET /posts/:id - 특정 포스트 조회
   */
  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postsService.getPostById(+id);
  }

  /**
   * POST /posts - 새 포스트 생성
   */
  @Post()
  createPost(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.createPost(author, title, content);
  }

  /**
   * PUT /posts/:id - 포스트 수정
   */
  @Put(':id')
  updatePost(
    @Param('id') id: string,
    @Body('author') author?: string,
    @Body('title') title?: string,
    @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(+id, author, title, content);
  }

  /**
   * DELETE /posts/:id - 포스트 삭제
   */
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
```

---

## Service

Service는 **비즈니스 로직을 처리**하는 Provider입니다. 데이터베이스 접근, 외부 API 호출, 복잡한 계산 등의 실제 작업을 수행합니다.

### Service의 주요 특징

- `@Injectable()` 데코레이터로 정의
- 비즈니스 로직과 데이터 처리 담당
- Controller에서 주입받아 사용
- 다른 Service나 Repository를 주입받을 수 있음

### 실제 예시 (PostsService)

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/post.entity';

@Injectable() // Provider로 등록 가능하게 만드는 데코레이터
export class PostsService {
  constructor(
    // Repository 주입 - TypeORM을 통한 데이터베이스 접근
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  // 모든 포스트 조회
  async getAllPosts(): Promise<PostsModel[]> {
    return await this.postsRepository.find();
  }

  // ID로 특정 포스트 조회
  async getPostById(id: number): Promise<PostsModel> {
    const post = await this.postsRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('포스트를 찾을 수 없습니다.');
    }

    return post;
  }

  // 새 포스트 생성
  async createPost(
    author: string,
    title: string,
    content: string,
  ): Promise<PostsModel> {
    const post = this.postsRepository.create({
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });

    return await this.postsRepository.save(post);
  }

  // 포스트 수정
  async updatePost(
    id: number,
    author?: string,
    title?: string,
    content?: string,
  ): Promise<PostsModel> {
    const post = await this.getPostById(id);

    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;

    return await this.postsRepository.save(post);
  }

  // 포스트 삭제
  async deletePost(id: number): Promise<number> {
    await this.getPostById(id); // 존재 여부 확인
    await this.postsRepository.delete(id);
    return id;
  }
}
```

---

## Module

Module은 **관련된 Controller, Service, Provider들을 묶어 관리**하는 단위입니다. 애플리케이션의 구조를 조직화하고 의존성을 관리합니다.

### Module의 주요 특징

- `@Module()` 데코레이터로 정의
- `controllers`: HTTP 요청을 처리할 Controller 등록
- `providers`: 의존성 주입이 가능한 Provider 등록
- `imports`: 다른 모듈을 가져와 사용
- `exports`: 다른 모듈에서 사용할 수 있도록 Provider 내보내기

### 실제 예시 (PostsModule)

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    // TypeORM 모듈에서 PostsModel Entity 사용
    TypeOrmModule.forFeature([PostsModel]),
  ],
  // HTTP 요청을 처리할 Controller 등록
  controllers: [PostsController],
  // 의존성 주입 가능한 Provider 등록
  providers: [PostsService],
  // 다른 모듈에서 사용할 수 있도록 내보내기 (선택사항)
  // exports: [PostsService],
})
export class PostsModule {}
```

---

## Provider 간의 의존성 주입 흐름
