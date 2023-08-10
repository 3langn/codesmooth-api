import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class ContactRequest {
  @IsString({
    message: "Tên phải là chuỗi",
  })
  @IsNotEmpty({
    message: "Tên không được để trống",
  })
  name: string;

  @IsEmail(
    {},
    {
      message: "Email không hợp lệ",
    },
  )
  @IsNotEmpty({
    message: "Email không được để trống",
  })
  @IsString({
    message: "Email phải là chuỗi",
  })
  email: string;

  @IsString({
    message: "Nội dung phải là chuỗi",
  })
  @IsNotEmpty({
    message: "Nội dung không được để trống",
  })
  message: string;

  @IsString({
    message: "Chủ đề phải là chuỗi",
  })
  @IsNotEmpty({
    message: "Chủ đề không được để trống",
  })
  subject: string;

  @IsString({
    message: "Số điện thoại phải là chuỗi",
  })
  @IsNotEmpty({
    message: "Số điện thoại không được để trống",
  })
  @IsPhoneNumber("VN", {
    message: "Số điện thoại không hợp lệ",
  })
  phone: string;
}
