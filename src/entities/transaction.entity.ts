import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { generateTransactionId } from "../common/generate-nanoid";
import { TransactionStatus, TransactionType } from "../common/enum/transaction";
import { UserEntity } from "./user.entity";

@Entity("transaction")
export class TransactionEntity {
  @PrimaryColumn("varchar", { length: 15 })
  id: string;

  @Column({
    type: "bigint",
  })
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  user: UserEntity;

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

  @BeforeInsert()
  generateId() {
    this.id = generateTransactionId();
  }
}
