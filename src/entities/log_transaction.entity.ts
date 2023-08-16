import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";

@Entity("log_trans_error", { schema: "public" })
export class LogTransError extends BaseEntity {
  @Column()
  message: string;

  @Column({ nullable: true })
  content: string;

  @Column()
  transfer_amount: number;
}
