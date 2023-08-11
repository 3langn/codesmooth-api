import { Column, Entity, Unique } from "typeorm";
import { TokenType } from "../common/constants/token-type";
import { BaseEntity } from "../common/abstract.entity";

@Unique(["user_id", "type"])
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
