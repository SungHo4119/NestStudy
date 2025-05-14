import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, TempUserModel } from 'src/entity/temp.user.entity';
import { Repository } from 'typeorm';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(TempUserModel)
    private readonly tempUserRepository: Repository<TempUserModel>,
  ) {}

  @Post('temp/users')
  async postUsers() {
    return await this.tempUserRepository.save({ type: Role.ADMIN });
  }
  @Get('temp/users')
  async getUsers() {
    return await this.tempUserRepository.find({
      // select: { id: true, title: true },
    });
  }

  @Patch('temp/users/:id')
  async patchUsers(@Param('id') id: number) {
    const user = await this.tempUserRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    user.title = '제목2';
    await this.tempUserRepository.save(user);
    return user;
  }
}
