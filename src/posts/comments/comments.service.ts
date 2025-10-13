import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { DEFAULT_COMMENT_FIND_OPTIONS } from 'src/posts/comments/const/default-comment-find-options';
import { CreatePostCommentDto } from 'src/posts/comments/dto/create-commentf.dto';
import { PaginateCommentsDto } from 'src/posts/comments/dto/paginate-comments.dto';
import { CommentsModel } from 'src/posts/comments/entity/comment.entity';
import { UsersModel } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsModel)
    private readonly CommentsRepository: Repository<CommentsModel>,

    private readonly commonService: CommonService,
  ) {}

  async PaginateComments(dto: PaginateCommentsDto, postId: number) {
    return await this.commonService.paginate(
      dto,
      this.CommentsRepository,
      {
        ...DEFAULT_COMMENT_FIND_OPTIONS,
        where: {
          post: { id: postId },
        },
      },
      `posts/${postId}/comments`,
    );
  }

  async getCommentById(commentId: number) {
    const comment = await this.CommentsRepository.findOne({
      ...DEFAULT_COMMENT_FIND_OPTIONS,
      where: { id: commentId },
    });
    if (!comment) {
      throw new BadRequestException(`${commentId} 댓글이 존재하지 않습니다.`);
    }

    return comment;
  }

  async createComment(
    postId: number,
    dto: CreatePostCommentDto,
    author: UsersModel,
  ) {
    return this.CommentsRepository.save({
      ...dto,
      post: {
        id: postId,
      },
      author,
    });
  }

  async updateComment(commentId: number, dto: Partial<CreatePostCommentDto>) {
    const prevComment = await this.CommentsRepository.preload({
      id: commentId,
      ...dto,
    });

    if (!prevComment) {
      throw new BadRequestException(`${commentId} 댓글이 존재하지 않습니다.`);
    }

    const newComment = await this.CommentsRepository.save(prevComment);

    return newComment;
  }

  async deleteComment(commentId: number) {
    const comment = await this.CommentsRepository.findOneBy({ id: commentId });

    if (!comment) {
      throw new BadRequestException(`${commentId} 댓글이 존재하지 않습니다.`);
    }
    await this.CommentsRepository.delete(commentId);
  }
}
