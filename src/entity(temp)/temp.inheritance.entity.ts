// /**
//  * 상속으로 테이블 생성
//  */

// import {
//   ChildEntity,
//   Column,
//   CreateDateColumn,
//   Entity,
//   PrimaryGeneratedColumn,
//   TableInheritance,
//   UpdateDateColumn,
// } from 'typeorm';

// export class BaseModel {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @CreateDateColumn()
//   caretedAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @Entity({ name: 'temp_book' })
// export class TempBookModel extends BaseModel {
//   @Column()
//   name: string;
// }

// @Entity({ name: 'temp_car' })
// export class TempCarModel extends BaseModel {
//   @Column()
//   brand: string;
// }

// /**
//  * single table inheritance
//  * - 하나의 테이블로 데이터를 관리해야할 필요가 있는 경우 고려해볼수 있다.
//  */
// @Entity()
// @TableInheritance({
//   column: {
//     name: 'type',
//     type: 'varchar',
//   },
// })
// export class TempSingleBaseModel {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @CreateDateColumn()
//   caretedAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;
// }

// @ChildEntity()
// export class ComputerModel extends TempSingleBaseModel {
//   @Column()
//   brand: string;
// }

// @ChildEntity()
// export class AirplanceModel extends TempSingleBaseModel {
//   @Column()
//   country: string;
// }
