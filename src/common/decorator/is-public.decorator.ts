import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// 해당 데코레이터가 적용된 메서드나 클래스는 인증을 필요로 하지 않음을 나타냄
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
