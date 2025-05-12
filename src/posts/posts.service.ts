import { Injectable, NotFoundException } from '@nestjs/common';

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
// Injectable: 주입 할 수 있다.
// module에 사용하기 위해서는 @Injectable()을 작성 해 주어야한다.
@Injectable()
export class PostsService {
  getAllPosts(): PostModel[] {
    return posts;
  }

  getPostById(id: number): PostModel {
    const post = posts.find((post) => post.id === id);
    if (!post) {
      // NotFoundException - NestJS에서 기본으로 제공하는 에러 타입
      throw new NotFoundException();
    }

    return post;
  }

  createPost(author: string, title: string, content: string) {
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

  updatePost(id: number, author?: string, title?: string, content?: string) {
    const post: PostModel | undefined = posts.find((post) => post.id === id);
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
      prvePost.id === id ? post : prvePost,
    );

    return post;
  }

  deletePost(id: number) {
    const post: PostModel | undefined = posts.find((post) => post.id === +id);
    if (!post) {
      throw new NotFoundException();
    }

    posts = posts.filter((post) => post.id !== +id);

    return id;
  }
}
