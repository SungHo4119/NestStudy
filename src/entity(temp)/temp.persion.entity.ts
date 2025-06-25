// import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// /**
//  * Entity Enbeddubg
//  */
// export class Name {
//   // ClassName + Column으로 컬럼명이 생성된다 ( nameFirst )
//   @Column()
//   first: string;

//   // nameLastname ====> lastName 으로 하였음에도. 저렇게 생성됨
//   @Column({ name: 'lastName' })
//   last: string;
// }

// @Entity({ name: 'temp_student' })
// export class TempStudentModel {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column(() => Name)
//   name: Name;

//   @Column()
//   class: string;
// }

// @Entity({ name: 'temp_teacher' })
// export class TempTeacherModel {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column(() => Name)
//   name: Name;

//   @Column()
//   salary: number;
// }
