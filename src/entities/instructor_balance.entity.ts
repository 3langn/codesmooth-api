import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";

@Entity("instructor_balance")
export class InstructorBalanceEntity extends BaseEntity {
  @Column()
  instructor_id: number;

  @Column()
  current_balance: number;
}
