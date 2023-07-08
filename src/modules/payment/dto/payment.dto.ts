import { IsEnum, IsNumber, IsString } from "class-validator";
import { TransactionType } from "../../../common/enum/transaction";
import { PaymentMethod } from "../../../common/enum/payment-method";

export class CreatePaymentUrlInput {
  @IsNumber(undefined, {
    message: "course_id must be number",
  })
  course_id: number;

  @IsEnum(PaymentMethod, {
    message: `payment_method must be in ${Object.values(PaymentMethod)}`,
  })
  payment_method: PaymentMethod;
}
