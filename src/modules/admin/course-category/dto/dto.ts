import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CourseCategoryType } from "../../../../common/enum/course-category-type";

export class CreateCourseCategoryDto {
  @IsNotEmpty({ message: "Tên danh mục không được để trống" })
  @IsString({ message: "Tên danh mục phải là một chuỗi" })
  title: string;

  @IsEnum(CourseCategoryType)
  type: CourseCategoryType;

  @IsNumber(undefined, { message: "Id khóa học phải là một số" })
  courseId: number;
}

export class UpdateCourseCategoryDto {
  @IsNotEmpty({ message: "Tên danh mục không được để trống" })
  @IsString({ message: "Tên danh mục phải là một chuỗi" })
  title: string;
}

export class SwapOrderRequestDto {
  @IsNotEmpty({ message: "Id danh mục không được để trống" })
  @IsNumber(undefined, { message: "Id danh mục phải là một số" })
  categoryId1: number;

  @IsNotEmpty({ message: "Id danh mục không được để trống" })
  @IsNumber(undefined, { message: "Id danh mục phải là một số" })
  categoryId2: number;
}
