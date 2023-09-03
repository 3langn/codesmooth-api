import { Column, Entity } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
export enum NotificationType {
  INFO = "info",
  USER_PAYMENT = "payment",
  USER_PAYMENT_FAILED = "payment_failed",
  INCOME = "income",
  WITHDRAW = "withdraw",
}

export type InfoBody = {
  message: string;
};

export type UserPaymentBody = {
  message: string;
};

export type ManagePaymentBody = {
  message: string;
  income: number;
};

export type NotificationBody = InfoBody | UserPaymentBody | ManagePaymentBody;

@Entity("notifications")
export class NotificationEntity extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: "jsonb" })
  body: NotificationBody;

  @Column({ type: "enum", enum: NotificationType })
  type: NotificationType;

  @Column({ nullable: true })
  user_id: number;

  @Column({ default: false })
  read: boolean;
}
