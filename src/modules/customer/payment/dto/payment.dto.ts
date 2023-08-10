import { IsEnum, IsNumber } from "class-validator";
import { Optional } from "@nestjs/common";
import { PaymentMethod } from "../../../../common/enum/payment-method";

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

export class CalculateRequestDto {
  @IsNumber(undefined, {
    message: "course_id must be number",
  })
  course_id: number;

  @Optional()
  promotion_code: string;
}
