import { Column, Entity } from "typeorm";
import { TokenType } from "../common/constants/token-type";
import { BaseEntity } from "../common/abstract.entity";

@Entity("tokens")
export class TokenEntity extends BaseEntity {
  @Column({ type: "int" })
  user_id: number;

  @Column({ type: "varchar" })
  token: string;

  @Column({ type: "varchar" })
  type: TokenType;

  @Column({ type: "timestamp" })
  expires_at: Date;
}
