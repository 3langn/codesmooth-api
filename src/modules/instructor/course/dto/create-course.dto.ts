import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
} from "class-validator";
import { GreaterThanOrEqual } from "../../../../decorators/validates/GreaterThanOrEqual";
import { CourseLevel, CourseTargetAudience } from "../../../../common/enum/course";
import { Column } from "typeorm";
import { IsArrayLengthGreaterThanZero } from "../../../../decorators/validates/ValidatorConstraint";
import { GreaterThanOrEqualSpecific } from "../../../../decorators/validates/GreaterThanOrEqualSpecific";

export class SaveCourseDto {
  @IsString({ message: "Tên khóa học phải là một chuỗi" })
  name: string;

  @IsString({ message: "Mô tả phải là một chuỗi" })
  description: string;

  @IsString({ message: "Mô tả ngắn phải là một chuỗi" })
  short_description: string;

  @IsNumber(
    {
      maxDecimalPlaces: 18,
      allowNaN: false,
      allowInfinity: false,
    },
    {
      message: "Giá khóa học phải là một số",
    },
  )
  @Validate(GreaterThanOrEqualSpecific, [0, 15000], {
    message: "Giá khóa học phải bằng 0 hoặc lớn hơn hoặc bằng 15000",
  })
  price: number;

  @IsNumber(
    {
      maxDecimalPlaces: 18,
      allowNaN: false,
      allowInfinity: false,
    },
    {
      message: "Giá gốc khoá học phải là một số",
    },
  )
  @Validate(GreaterThanOrEqual, ["price"], {
    message: "Gía gốc phải lớn hơn hoặc bằng giá khóa học",
  })
  base_price: number;

  @IsArray({ message: "Kĩ năng phải là một mảng" })
  @IsArrayLengthGreaterThanZero({ message: "Kĩ năng phải có ít nhất 1 phần tử" })
  category_ids: number[];

  @IsArray({ message: "Mục tiêu khóa học phải là một mảng" })
  @IsArrayLengthGreaterThanZero({ message: "Mục tiêu khóa học phải có ít nhất 1 phần tử" })
  objectives: string[];

  @IsEnum(CourseTargetAudience, {
    message: `Đối tượng khóa học phải là một trong các giá trị sau: ${Object.values(
      CourseTargetAudience,
    ).join(", ")}`,
  })
  target_audience: CourseTargetAudience;

  @IsEnum(CourseLevel, {
    message: `Cấp độ phải là một trong các giá trị sau: ${Object.values(CourseLevel).join(", ")}`,
  })
  level: CourseLevel;

  // @IsNumber(undefined, {
  //   message: "main_category_id phải là number",
  // })
  // main_category_id: number;

  @IsArray({ message: "Yêu cầu phải là một mảng" })
  @IsArrayLengthGreaterThanZero({ message: "Yêu cầu phải có ít nhất 1 phần tử" })
  requirements: string[];

  @IsEmail(
    {},
    {
      message: "feedback email không hợp lệ",
    },
  )
  feedback_email: string;

  @IsString({ message: "thumbnail phải là chuỗi" })
  thumbnail: string;
}
