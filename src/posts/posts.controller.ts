import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

// nest g resource 를 이용해서 모듈을 생성 할 수 있다.
/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 */
interface Post {
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('')
  getPost(): Post {
    return {
      author: 'newJeans_Official',
      title: '뉴진스 민지',
      content: '메이크업 고치고 있는 민지?',
      likeCount: 100000,
      commentCount: 5000000,
    };
  }
}
