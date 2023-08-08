import { IsNotEmpty, IsString } from "class-validator";

export class RejectRequest {
  @IsString()
  @IsNotEmpty()
  rejected_reason: string;
}
