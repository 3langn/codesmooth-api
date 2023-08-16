import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { BalanceEntity } from "./balance.entity";
import { TransactionEntity } from "./transaction.entity";

@Entity("balance_histories")
export class BalanceHistoryEntity extends BaseEntity {
  @Column()
  instructor_id: number;

  @Column()
  current_balance: number;

  @Column()
  previous_balance: number;

  @Column()
  amount: number;

  @ManyToOne(() => BalanceEntity)
  @JoinColumn({ name: "balance_id" })
  balance: BalanceEntity;

  @Column()
  balance_id: number;

  @ManyToOne(() => TransactionEntity)
  @JoinColumn({ name: "transaction_id" })
  transaction: TransactionEntity;

  @Column()
  transaction_id: number;
}
