import { IsArray, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { GreaterThanOrEqual } from "../../../../decorators/validates/GreaterThanOrEqual";

export class SaveCourseDto {
  @IsString({ message: "name phải là string" })
  @IsNotEmpty({ message: "name không được để trống" })
  name: string;

  @IsNotEmpty({ message: "description không được để trống" })
  @IsString({ message: "description phải là string" })
  description: string;

  @IsString({ message: "short_description phải là string" })
  @IsNotEmpty({ message: "short_description không được để trống" })
  short_description: string;

  @IsNumber(
    {
      maxDecimalPlaces: 18,
      allowNaN: false,
      allowInfinity: false,
    },
    {
      message: "price phải là number",
    },
  )
  price: number;

  @IsNumber(
    {
      maxDecimalPlaces: 18,
      allowNaN: false,
      allowInfinity: false,
    },
    {
      message: "base_price phải là number",
    },
  )
  @Validate(GreaterThanOrEqual, ["price"], {
    message: "base_price phải lớn hơn hoặc bằng price",
  })
  base_price: number;

  // @IsArray({ message: "Will learn must be an array" })
  // will_learns: string[];

  // @IsArray({ message: "Skills must be an array" })
  // skills: string[];

  @IsArray({ message: "category_ids phải là array" })
  category_ids: number[];

  @IsArray({ message: "objectives phải là array" })
  objectives: string[];

  @IsString({ message: "target_audience phải là string" })
  target_audience: string;

  @IsArray({ message: "requirements phải là array" })
  requirements: string[];

  @IsString({ message: "feedback_email phải là string" })
  feedback_email: string;

  @IsString({ message: "thumbnail phải là string" })
  thumbnail: string;
}
