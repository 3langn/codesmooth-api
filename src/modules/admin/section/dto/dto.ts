import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { SectionTypeEnum } from "../../../../common/enum/course-category-type";

export class CreateSectionDto {
  @IsNotEmpty({ message: "Tên section không được để trống" })
  @IsString({ message: "Tên section phải là một chuỗi" })
  title: string;

  @IsEnum(SectionTypeEnum)
  type: SectionTypeEnum;

  @IsNumber(undefined, { message: "Thứ tự phải là một số" })
  order: number;

  @IsNumber(undefined, { message: "Id khóa học phải là một số" })
  courseId: number;
}

export class UpdateSectionDto {
  @IsNotEmpty({ message: "Tên section không được để trống" })
  @IsString({ message: "Tên section phải là một chuỗi" })
  title: string;
}

export class SwapOrderRequestDto {
  @IsNotEmpty({ message: "Id section không được để trống" })
  @IsNumber(undefined, { message: "Id section phải là một số" })
  sectionId1: number;

  @IsNotEmpty({ message: "Id section không được để trống" })
  @IsNumber(undefined, { message: "Id section phải là một số" })
  sectionId2: number;
}

export class AddSectionDto {}
