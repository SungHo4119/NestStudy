import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { promises } from 'fs';
import { basename, join } from 'path';
import { POST_IMAGE_PATH, TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { ImageModel } from 'src/common/entity/image.entity';
import { CreatePostImageDto } from 'src/posts/image/dto/create-image.dto';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class PostImagesService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ImageModel>(ImageModel)
      : this.imageRepository;
  }

  async createPostImage(dto: CreatePostImageDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);
    // dto에 이미지 이름을 기반으로 파일의 경로를 생성한다.
    const tempFilePath = join(TEMP_FOLDER_PATH, dto.path);

    try {
      // 파일이 존재하는지 확인
      await promises.access(tempFilePath);
    } catch {
      throw new BadRequestException('존재하지 않은 파일 입니다.');
    }

    // 파일이름가져오기
    // /User/aaa/bbb/ccc/ddd.jpg => ddd.jpg
    const fileName = basename(tempFilePath);

    // 이동할 Post 폴더의 경로
    const newPath = join(POST_IMAGE_PATH, fileName);

    // save
    const result = await repository.save({
      ...dto,
    });

    await promises.rename(tempFilePath, newPath);

    return result;
  }
}
