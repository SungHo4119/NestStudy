import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

/**
 * export const Role = {
  USER: 'user',
  ADMIN: 'admin',
} as const;
export type Role = (typeof Role)[keyof typeof Role];
위의 내용과 같다.
 */
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}
@Entity({ schema: 'public', name: 'temp_users' })
export class TempUserModel {
  /**
   * 자동으로 ID를 생성한다.
   * PrimaryGeneratedColumn
   *
   * PK를 직접 생성하는 경우
   * PrimaryColumn
   *
   */
  @PrimaryGeneratedColumn()
  id: number;
  /**
   * @PrimaryGeneratedColumn('uuid') // 자동 생성 (typeorm 내부 로직)
   *
   * @PrimaryColumn({
   * name: 'id',
   * type: 'uuid',
   * })
   * id: string;
   * @BeforeInsert() // 특정 UUID 버전을 사용해야 하는 경우
   * generateId(): void {
   * this.id = uuidv7();
   * }
   */
  @Column({
    // 데이터 베이스에서 인지하는 컬럼 타입
    // 자동으로 유추됨 - 선언해주는편이 좋은것같음
    type: 'varchar',
    // 데이터베이스 컬럼 이름
    name: 'title',
    // 값의 길이
    length: 300,
    // null 여부
    nullable: true,
    // true면 처음 저장할 때만 값 저장 가능
    // 이후에는 값 변경 불가능
    // 최신버전의 경우 오류를 반환하지 않음
    update: true,
    // find()를 실행 할 때 기본으로 값을 불러올지
    // 기본값 true
    select: true,
    // 기본값
    default: null,
    // 컬럼중에서 유일무이한 값이 되는지
    // null은 허용
    // 중복인 경우 QueryFailedError
    unique: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  type: Role;

  // 데이터가 생성되는 날짜와 시간이 자동으로 찍힌다.
  @CreateDateColumn({
    select: false,
  })
  createdAt: Date;

  // 데이터가 업데이트 되는 경우 날짜와 시간이 자동으로 찍힌다.
  @UpdateDateColumn({
    select: false,
  })
  updatedAt: Date;

  // 데이터가 업데이트 되는 경우 1씩 증가한다
  // 처음 생성 값은 1이고
  // save가 몇번 불렸는지 기억한다. - 데이터가 변경되지 않는 경우 증가하지 않는다.
  @VersionColumn()
  version: number;

  // increment : 데이터를 생성할 때마다 1씩 자동으로 증가
  // uuid: 데이터가 생성 될 때 uuid를 자동으로 생성(string)
  @Column()
  @Generated('uuid')
  additionaalId: number;
}
