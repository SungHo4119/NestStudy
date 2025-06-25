import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async createUser(nickname: string, email: string, password: string) {
    const user = this.userRepository.create({
      nickname,
      email,
      password,
    });

    const newUser = await this.userRepository.save(user);

    return newUser;
  }

  async getAllUsers() {
    return this.userRepository.find();
  }
}
