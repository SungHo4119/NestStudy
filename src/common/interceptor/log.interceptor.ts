import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    /**
     * 요청이 들어올때 request 요청이 들어온 타임스탬프르 찍는다.
     * [Req] {요청 path} 요청 시간
     * 요청이 끝날때 타임스탬프를 찍는다.
     * [Res] {응답 path} 응답 시간
     */

    const now = new Date();
    const req = context.switchToHttp().getRequest();
    const path = req.originalUrl;

    console.log(`[Req] ${path} ${now.toLocaleString('kr')}`);

    // next.handle()을 실행하는 순간 라우트의 로직이 전부 실행되고 응답이 반환된다.
    // observable로 반환된다.
    return next.handle().pipe(
      // Rxjs에 대한 함수를 사용 가능하다.
      // 순서대로 실행 가능하다.
      // tab은 응답값을 확인 할 수 있다 ( 변형은 불가능 )
      tap(() => {
        // console.log(observable);
        console.log(
          `[Res] ${path} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`,
        );
      }),
      // map((observable) => {
      //   return { response: observable, message: '1' };
      // }),
      // tap((observable) => {
      //   console.log(observable);
      // }),
    );
  }
}
