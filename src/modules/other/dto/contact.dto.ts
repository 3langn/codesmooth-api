import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ContactRequest {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
