import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { TransactionEntity } from "./transaction.entity";
import { InstructorBalanceEntity } from "./instructor_balance.entity";
import { TransactionType } from "../common/enum/transaction";
import { CourseEntity } from "./course.entity";
import { UserEntity } from "./user.entity";

@Entity("instructor_balance_histories")
export class InstructorBalanceHistoryEntity extends BaseEntity {
  @Column()
  instructor_id: number;

  @Column()
  current_balance: number;

  @Column()
  previous_balance: number;

  @Column()
  amount: number;

  @Column({ enum: TransactionType, nullable: true })
  type: TransactionType;

  @ManyToOne(() => InstructorBalanceEntity)
  @JoinColumn({ name: "balance_id" })
  balance: InstructorBalanceEntity;

  @Column()
  balance_id: number;

  @ManyToOne(() => TransactionEntity)
  @JoinColumn({ name: "transaction_id" })
  transaction: TransactionEntity;

  @Column()
  transaction_id: string;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: "course_id" })
  course: CourseEntity;

  @Column({ nullable: true })
  course_id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column({ nullable: true })
  user_id: number;
}
