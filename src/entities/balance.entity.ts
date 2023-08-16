import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";

@Entity("balance")
export class BalanceEntity extends BaseEntity {
  @Column()
  current_balance: number;
}
