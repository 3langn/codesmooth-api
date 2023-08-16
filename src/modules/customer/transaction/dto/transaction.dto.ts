import { IsEnum, IsNumber, IsString } from "class-validator";
import { TransactionStatus, TransactionType } from "../../../../common/enum/transaction";
import { PaymentMethod } from "../../../../common/enum/payment-method";

export class CreateTransactionInput {
  id: string;

  user_id: number;

  instructor_id: number;

  type: TransactionType;

  course_id: number;

  course_name: string;

  description: string;

  amount: number;

  instructor_income: number;

  income: number;

  status?: TransactionStatus;

  payment_method: PaymentMethod;

  gen_secure_hash: string;

  discount: number;
}
