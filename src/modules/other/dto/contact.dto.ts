import { IsString } from "class-validator";

export class ContactRequest {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  message: string;

  @IsString()
  subject: string;

  @IsString()
  phone: string;
}
