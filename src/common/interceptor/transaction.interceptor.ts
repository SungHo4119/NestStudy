import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    // queryRunner를 생성한다.
    const qr = this.dataSource.createQueryRunner();

    // queryRunner에 연결한다.
    await qr.connect();

    await qr.startTransaction();

    req.queryRunner = qr;

    return next.handle().pipe(
      catchError(async (e) => {
        await qr.rollbackTransaction();
        await qr.release();
        throw new InternalServerErrorException(e.message);
      }),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      tap(async () => {
        await qr.commitTransaction().then(() => qr.release());
        await qr.release();
      }),
    );
  }
}
