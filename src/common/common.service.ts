import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENV_PROTOCOL } from 'src/common/const/env-keys.const';
import { FILTER_MAPPER } from 'src/common/const/filter-mapper.const';
import { BasePaginationDto } from 'src/common/dto/base-pagination.dto';
import { BaseModel } from 'src/common/entity/base.entity';
import { OrderBy, PaginationID } from 'src/common/type/pagination.type';
import {
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) {}
  async paginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T>,
    path: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    }
    return this.cursorPaginate(dto, repository, overrideFindOptions, path);
  }

  private async pagePaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T>,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);
    const [data, count] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
    });

    return {
      data,
      total: count,
    };
  }

  private async cursorPaginate<T extends BaseModel>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    /**
     * where__likeCount__more_than
     *
     * where__title__iLike
     */
    const findOptions = this.composeFindOptions<T>(dto);

    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    const lastItem =
      results.length > 0 && results.length === dto.take
        ? results[results.length - 1]
        : null;

    const protocol = this.configService.get(ENV_PROTOCOL);
    const host = this.configService.get(ENV_PROTOCOL);
    const port = this.configService.get(ENV_PROTOCOL);

    const nextUrl =
      lastItem && new URL(`${protocol}://${host}:${port}/${path}`);

    if (nextUrl) {
      for (const [key, value] of Object.entries(dto)) {
        if (
          value !== undefined &&
          key !== (PaginationID.MORE_THAN as string) &&
          key !== (PaginationID.LESS_THAN as string)
        ) {
          nextUrl.searchParams.append(key, dto[key]);
        }
      }

      const key =
        dto.order__createdAt === OrderBy.ASC
          ? PaginationID.MORE_THAN
          : PaginationID.LESS_THAN;
      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: results,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: results.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  private composeFindOptions<T extends BaseModel>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    /**
     * where
     * order
     * take
     * skip -> page 기반일때만
     *
     * 1) where로 시작한다면 필더 로직을 적용한다.
     * 2) order로 시작한다면 정렬로직을 적용한다.
     * 3) 필터 로직을 적용했을떄 '__' 기준으로 split 했을때 3개의 값으로 나뉘는지 2개의 값으로 나뉘는지 확인한다.
     *   - 3개의 값으로 나뉜다면 FILTER_MAPPER에 해당되는 operator 함수를 찾아서 적용한다.
     *     - [where, title, iLike]
     *   - 2개의 값으로 나뉜다면 정확한 값을 필더하는 것이기 때문에 operator 없이 적용한다.
     *     - [where, id]
     * 4) order는 3-2와 같이 적용한다.
     */

    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined && key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseFilter<T>(key, value),
        };
      } else if (value !== undefined && key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseFilter<T>(key, value),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? (dto.page - 1) * dto.take : undefined,
    };
  }

  private parseFilter<T extends BaseModel>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> | FindOptionsOrder<T> {
    const options: FindOptionsWhere<T> = {};
    const split = key.split('__');

    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `where 필터는 '__'로 split 했을때 길이가 2 또는 3이여야합니다 - 문제되는 키값 : ${key}`,
      );
    }

    if (split.length === 2) {
      // [where, id]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, field] = split;
      options[field] = value;
    } else {
      /**
       * 길이가 3인 경우에는 Typeorm 유틸리티 적용이 필요한 경우
       * where__id__more_than의 경우
       * 3번째 값은 typeorm 유틸리티가 된다
       */

      // [where, id, more_than]
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, field, operator] = split;

      // between의 경우에는 value가 2개의 값을 가져야하고 In의 경우 배열을 받아야한다. 다양하게 처리하는 방법을 작성하진 않았다.
      // 만약에 split 대상 문자가 존재하지 않으면 길이가 무조건 1이다.
      // const values = value.toString().split(',');
      // if (operator === 'between') {
      //   options[field] = FILTER_MAPPER[operator](values[0], values[1]);
      // } else {
      //   options[field] = FILTER_MAPPER[operator](value);
      // }

      if (operator === 'i_like') {
        options[field] = FILTER_MAPPER[operator](`%${value}%`);
      } else {
        options[field] = FILTER_MAPPER[operator](value);
      }
    }
    return options;
  }
}
