import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { GreaterThanOrEqual } from "../../../../decorators/validates/GreaterThanOrEqual";
import { CourseLevel, CourseTargetAudience } from "../../../../common/enum/course";
import { Column } from "typeorm";
import { IsArrayLengthGreaterThanZero } from "../../../../decorators/validates/ValidatorConstraint";

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

  @IsArray({ message: "category_ids phải là array" })
  @IsArrayLengthGreaterThanZero({ message: "category_ids phải có ít nhất 1 phần tử" })
  category_ids: number[];

  @IsArray({ message: "objectives phải là array" })
  @IsArrayLengthGreaterThanZero({ message: "objectives phải có ít nhất 1 phần tử" })
  objectives: string[];

  @IsEnum(CourseTargetAudience, {
    message: `target_audience phải là một trong các giá trị sau: ${Object.values(
      CourseTargetAudience,
    ).join(", ")}`,
  })
  target_audience: CourseTargetAudience;

  @IsEnum(CourseLevel, {
    message: `level phải là một trong các giá trị sau: ${Object.values(CourseLevel).join(", ")}`,
  })
  level: CourseLevel;

  // @IsNumber(undefined, {
  //   message: "main_category_id phải là number",
  // })
  // main_category_id: number;

  @IsArray({ message: "requirements phải là array" })
  @IsArrayLengthGreaterThanZero({ message: "requirements phải có ít nhất 1 phần tử" })
  requirements: string[];

  @IsString({ message: "feedback_email phải là string" })
  feedback_email: string;

  @IsString({ message: "thumbnail phải là string" })
  thumbnail: string;
}
