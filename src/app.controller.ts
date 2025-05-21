import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TempPostModel } from 'src/entity/temp.post.entity';
import { TempProfileModel } from 'src/entity/temp.profile.entity';
import { TempTagModel } from 'src/entity/temp.tag.entity';
import { Role, TempUserModel } from 'src/entity/temp.user.entity';
import { MoreThan, Repository } from 'typeorm';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(TempUserModel)
    private readonly tempUserRepository: Repository<TempUserModel>,

    @InjectRepository(TempProfileModel)
    private readonly tempProfileRepository: Repository<TempProfileModel>,

    @InjectRepository(TempPostModel)
    private readonly tempPostRepository: Repository<TempPostModel>,

    @InjectRepository(TempTagModel)
    private readonly tempTagRepository: Repository<TempTagModel>,
  ) {}

  @Post('temp/users')
  async postUsers() {
    return await this.tempUserRepository.save({
      type: Role.ADMIN,
      email: 'dev@example.com',
    });
  }
  @Get('temp/users')
  async getUsers() {
    return await this.tempUserRepository.find({
      // select: 어떤 프로퍼티를 조회할지, 기본은 모든 프로퍼티,
      select: {
        id: true,
        email: true,
        type: true,
        version: true,
        count: true,
        profile: {
          id: true,
          profileImg: true,
        },
      },
      // 필터링할 조건을 입력한다.
      // where: {id: 1, version:1}에 작성한 조건은 AND 조건으로 묶인다.
      // or로 묶고 싶다면 where: [{id: 1} ,{version: 1}]으로 작성한다.
      where: [
        {
          id: MoreThan(1),
          /**
           * TypeORM 유틸리티 함수
           * Not() : NOT 조건
           * LessThen() : < 조건
           * LessThanOrEqual() : <= 조건
           * MoreThan() : > 조건
           * MoreThanOrEqual() : >= 조건
           * Equal() : = 조건
           * Like() : LIKE 조건 - 대문자 소문자 구분
           *    Like('%value') -> value로 시작하는 값
           *    Like('value%') -> value로 끝나는 값
           *    Like('%value%') -> value로 포함된 값
           * ILike() : ILIKE 조건 - 대문자 소문자 구분 X
           * Between() : BETWEEN 조건 - Between(1, 10)
           * In() : IN 조건 - In([1, 2, 3])
           * IsNull() : NULL 조건
           * IsNotNull() : NOT NULL 조건
           */
        },
        {
          profile: {
            id: 1,
          },
        },
      ],
      // 관계를 가져오는 방법
      // relations을 추가한다면 select, where에 relations의 내용을 추가할 수 있다.
      relations: {
        profile: true,
      },

      // order: 정렬할 조건을 입력한다.
      // ASC : 오름차순, DESC : 내림차순
      order: {
        id: 'ASC',
      },

      // skip: 몇 개의 데이터를 건너뛸지 설정한다.
      skip: 0,

      // take: 몇 개의 데이터를 가져올지 설정한다.
      take: 0,
    });
  }

  @Patch('temp/users/:id')
  async patchUsers(@Param('id') id: number) {
    const user = await this.tempUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    await this.tempUserRepository.save(user);
    return user;
  }

  @Post('temp/user/profile')
  async createUserAndProfile(): Promise<TempUserModel> {
    const user = await this.tempUserRepository.save({
      email: 'dev@example.com',
    });

    await this.tempProfileRepository.save({
      user,
      profileImg: 'https://example.com/profile.jpg',
    });
    return user;
  }

  @Delete('temp/user/profile/:id')
  async deleteProfile(@Param('id') id: string): Promise<void> {
    await this.tempProfileRepository.delete({
      id: +id,
    });
  }

  @Post('temp/user/post')
  async createUserAndPost(): Promise<TempUserModel> {
    const user = await this.tempUserRepository.save({
      email: 'dev@example.com',
    });

    await this.tempPostRepository.save({
      author: user,
      title: 'Post 1',
    });
    await this.tempPostRepository.save({
      author: user,
      title: 'Post 2',
    });
    return user;
  }

  @Post('temp/posts/tags')
  async createPostTags() {
    const post1 = await this.tempPostRepository.save({
      title: 'NestJS',
    });

    const post2 = await this.tempPostRepository.save({
      title: 'Express',
    });

    const tag1 = await this.tempTagRepository.save({
      name: 'JavaScript',
      posts: [post1, post2],
    });
    const tag2 = await this.tempTagRepository.save({
      name: 'TypeScript',
      posts: [post1],
    });

    await this.tempPostRepository.save({
      title: 'NextJS',
      tags: [tag1, tag2],
    });

    return true;
  }

  @Get('temp/posts')
  async getPosts() {
    return await this.tempPostRepository.find({
      relations: {
        tags: true,
      },
    });
  }
  @Get('temp/tags')
  async getTags() {
    return await this.tempTagRepository.find({
      relations: {
        posts: true,
      },
    });
  }

  @Post('temp/sample')
  async sample() {
    // 모델에 해당하는 객체 생성 - 저장은 하지 않음
    const user1 = this.tempUserRepository.create({
      email: 'dev@example.com',
    });
    const user2 = await this.tempUserRepository.save(user1);

    // preload: 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가된 입력된 값으로 데이터베이스에서 가져온 값들을 대체함.
    // 저정하지는 않음
    const user3 = await this.tempUserRepository.preload({
      id: 2,
      email: 'dev2@example.com',
    });

    // 삭제
    await this.tempUserRepository.delete(user2.id);

    await this.tempUserRepository.increment(
      // 조회 조건
      {
        id: 2,
      },
      // 증가할 프로퍼티
      'count',
      // 증가할 값
      2,
    );

    await this.tempUserRepository.decrement(
      // 조회 조건
      {
        id: 2,
      },
      // 감소 프로퍼티
      'count',
      // 감소할 값
      2,
    );

    // 갯수 카운트
    const count = await this.tempUserRepository.count({
      where: {
        version: 1,
      },
    });

    // 전부 더하기
    // count - 더할 컬럼
    // where - 조건
    const sum = await this.tempUserRepository.sum('count', {
      version: 1,
    });

    // 평균
    // average - 평균을 구하는 함수
    const avg = await this.tempUserRepository.average('count', {
      version: 1,
    });

    // 최소값
    // minimum - 최소값을 구하는 함수
    const min = await this.tempUserRepository.minimum('count', {
      version: 1,
    });
    // 최대값
    // maximum - 최대값을 구하는 함수
    const max = await this.tempUserRepository.maximum('count', {
      version: 1,
    });

    // find - 모든 데이터 조회
    const users = await this.tempUserRepository.find();
    // findOne - 조건에 맞는 하나의 데이터 - 여러개인 경우 첫번째 데이터만 조회
    const user = await this.tempUserRepository.findOne({
      where: {
        id: 1,
      },
    });

    // 페이지 네이션 사용할떄
    const userAndCount = await this.tempUserRepository.findAndCount({
      take: 3,
      skip: 6,
    });

    return userAndCount;
  }
}
