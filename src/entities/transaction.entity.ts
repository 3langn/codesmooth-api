import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  VirtualColumn,
} from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { generateTransactionId } from "../common/generate-nanoid";
import { TransactionStatus, TransactionType } from "../common/enum/transaction";
import { UserEntity } from "./user.entity";
import { PaymentMethod } from "../common/enum/payment-method";
import { CourseEntity } from "./course.entity";

@Entity("transaction")
export class TransactionEntity {
  @PrimaryColumn("varchar", { length: 15 })
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @Column()
  instructor_id: number;

  @ManyToOne(() => UserEntity, (user) => user.instructor_transactions)
  @JoinColumn({ name: "instructor_id" })
  instructor: UserEntity;

  @Column()
  amount: number;

  @Column({ nullable: true })
  instructor_income: number;

  @Column({ nullable: true })
  income: number;

  @Column({ enum: TransactionType })
  type: TransactionType;

  @Column({ default: TransactionStatus.PENDING, enum: TransactionStatus })
  status: TransactionStatus;

  @Column()
  description: string;

  @Column()
  course_id: number;

  @Column()
  discount: number;

  @ManyToOne(() => CourseEntity)
  @JoinColumn({ name: "course_id" })
  course: CourseEntity;

  @Column()
  course_name: string;

  @Column({ nullable: true })
  failed_reason: string;

  @Column({ enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ nullable: true })
  trans_no: string;

  @Column({ nullable: true })
  bank_time: string;

  @Column({ default: "" })
  gen_secure_hash: string;

  @Column({ nullable: true })
  previous_balance: number;

  @Column({ nullable: true })
  current_balance: number;
}
