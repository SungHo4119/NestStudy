import { Injectable } from '@nestjs/common';
// 기능구현을 하는 파일

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
