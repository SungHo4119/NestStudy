import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFollowersModel } from 'src/users/entity/user-followers.entity';
import { QueryRunner, Repository } from 'typeorm';
import { UsersModel } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,
    @InjectRepository(UserFollowersModel)
    private readonly userFollowerRepository: Repository<UserFollowersModel>,
  ) {}

  getUsersRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UsersModel>(UsersModel)
      : this.userRepository;
  }
  getUserFollowerRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<UserFollowersModel>(UserFollowersModel)
      : this.userFollowerRepository;
  }

  async createUser(user: Pick<UsersModel, 'nickname' | 'email' | 'password'>) {
    // 1) nickname 중복확인
    const nicknameExists = await this.userRepository.exists({
      where: {
        nickname: user.nickname,
      },
    });

    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    // 2) email 중복확인
    const emailExists = await this.userRepository.exists({
      where: {
        email: user.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const userObject = this.userRepository.create(user);

    const newUser = await this.userRepository.save(userObject);

    return newUser;
  }

  async getAllUsers() {
    return this.userRepository.find();
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async followUser(followerId: number, followeeId: number, qr?: QueryRunner) {
    const userFollowerRepository = this.getUserFollowerRepository(qr);
    await userFollowerRepository.save({
      follower: {
        id: followerId,
      },
      followee: {
        id: followeeId,
      },
    });

    return true;
  }

  async getFollowers(userId: number, includeConfirmed: boolean) {
    const result = await this.userFollowerRepository.find({
      where: {
        followee: {
          id: userId,
        },
        isConfirmed: includeConfirmed,
      },
      relations: {
        followee: true,
        follower: true,
      },
    });

    return result.map((x) => x.follower);
  }

  async confirmFollow(
    followerId: number,
    followeeId: number,
    qr?: QueryRunner,
  ) {
    const userFollowerRepository = this.getUserFollowerRepository(qr);
    const existing = await userFollowerRepository.findOne({
      where: {
        follower: {
          id: followerId,
        },
        followee: {
          id: followeeId,
        },
      },
      relations: {
        followee: true,
        follower: true,
      },
    });

    if (!existing) {
      throw new BadRequestException('존재하지 않는 팔로우 요청입니다.');
    }

    await userFollowerRepository.save({
      ...existing,
      isConfirmed: true,
    });

    return true;
  }

  async deleteFollow(followerId: number, followeeId: number, qr?: QueryRunner) {
    const userFollowerRepository = this.getUserFollowerRepository(qr);
    await userFollowerRepository.delete({
      followee: {
        id: followeeId,
      },
      follower: {
        id: followerId,
      },
    });
    return true;
  }

  async incrementFollowerCount(userId: number, qr?: QueryRunner) {
    const userRepository = this.getUsersRepository(qr);

    await userRepository.increment(
      {
        id: userId,
      },
      'followerCount',
      1,
    );
  }

  async decrementFollowerCount(userId: number, qr?: QueryRunner) {
    const userRepository = this.getUsersRepository(qr);

    await userRepository.decrement(
      {
        id: userId,
      },
      'followerCount',
      1,
    );
  }

  async incrementFolloweeCount(userId: number, qr?: QueryRunner) {
    const userRepository = this.getUsersRepository(qr);

    await userRepository.increment(
      {
        id: userId,
      },
      'followeeCount',
      1,
    );
  }

  async decrementFolloweeCount(userId: number, qr?: QueryRunner) {
    const userRepository = this.getUsersRepository(qr);

    await userRepository.decrement(
      {
        id: userId,
      },
      'followeeCount',
      1,
    );
  }
}
