import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { generateTransactionId } from "../common/generate-nanoid";
import { TransactionStatus, TransactionType } from "../common/enum/transaction";

@Entity("transaction")
export class TransactionEntity {
  @PrimaryColumn("varchar", { length: 15 })
  id: string;

  @Column({
    type: "bigint",
  })
  user_id: number;

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
