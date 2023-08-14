import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { generateTransactionId } from "../common/generate-nanoid";
import { TransactionStatus, TransactionType } from "../common/enum/transaction";
import { UserEntity } from "./user.entity";
import { PaymentMethod } from "../common/enum/payment-method";

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

  @Column({
    nullable: true,
  })
  instructor_id: number;

  @ManyToOne(() => UserEntity, (user) => user.instructor_transactions)
  @JoinColumn({ name: "instructor_id" })
  instructor: UserEntity;

  @Column()
  amount: number;

  @Column({ enum: TransactionType })
  type: TransactionType;

  @Column({ default: TransactionStatus.PENDING, enum: TransactionStatus })
  status: TransactionStatus;

  @Column()
  description: string;

  @Column()
  course_id: number;

  @Column()
  course_name: string;

  @Column({ nullable: true })
  failed_reason: string;

  @Column({ enum: PaymentMethod })
  payment_method: PaymentMethod;

  @Column({ default: "" })
  trans_no: string;

  @Column({ default: "" })
  gen_secure_hash: string;
}
