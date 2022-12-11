import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import * as utils from "../common/generate-nanoid";
export class BaseEntity {
  @PrimaryColumn("bigint")
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @BeforeInsert()
  generateId() {
    this.id = utils.generateId(18);
  }
}
