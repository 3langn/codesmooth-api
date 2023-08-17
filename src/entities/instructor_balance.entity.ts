import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";

@Entity("instructor_balance")
export class InstructorBalanceEntity extends BaseEntity {
  @Column()
  instructor_id: number;

  @Column({ default: 0 })
  current_balance: number;
}
