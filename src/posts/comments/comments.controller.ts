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
} from '@nestjs/common';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { CreatePostCommentDto } from 'src/posts/comments/dto/create-commentf.dto';
import { PaginateCommentsDto } from 'src/posts/comments/dto/paginate-comments.dto';
import { UpdateCommentsDto } from 'src/posts/comments/dto/update-comments.dto';
import { IsCommentMineOrAdminGuard } from 'src/posts/comments/guard/is-comment-mine-or-admin.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { CommentsService } from './comments.service';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {
    /**
     * 1) Entity 생성
     * author -> 작성자
     * post -> 귀속되는 포스트
     * comment -> 댓글 내용
     * Like Count -> 좋아요 수
     *
     * id -> PrimaryGeneratedColumn
     * createdAt -> CreateDateColumn
     * updatedAt -> UpdateDateColumn
     *
     * 2) GET() Pagination
     * 3) GET(:commentId) 특정 코멘트 조회
     * 4) POST() 코멘트 생성
     * 5) PATCH(:commentId) 코멘트 수정
     * 6) DELETE(:commentId) 코멘트 삭제
     */
  }

  @Get()
  @IsPublic()
  async getComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() dto: PaginateCommentsDto,
  ) {
    return await this.commentsService.PaginateComments(dto, postId);
  }

  @Get(':commentId')
  @IsPublic()
  async getComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return await this.commentsService.getCommentById(commentId);
  }

  @Post()
  async createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() dto: CreatePostCommentDto,
    @User() user: UsersModel,
  ) {
    return await this.commentsService.createComment(postId, dto, user);
  }

  @Patch(':commentId')
  @UseGuards(IsCommentMineOrAdminGuard)
  async patchComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() dto: UpdateCommentsDto,
  ) {
    return await this.commentsService.updateComment(commentId, dto);
  }

  @Delete(':commentId')
  @UseGuards(IsCommentMineOrAdminGuard)
  async deleteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return await this.commentsService.deleteComment(commentId);
  }
}
