import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { LessonComponent } from "../../../entities/lesson.entity";

export class SaveLessonDto {
  @IsNumber(undefined, { message: "Id phải là một số" })
  id?: number;

  @IsNotEmpty({ message: "Tiêu đề không được để trống" })
  @IsString({ message: "Tiêu đề phải là một chuỗi" })
  title: string;

  isCompleted?: boolean;

  @IsString({ message: "Tóm tắt phải là một chuỗi" })
  summary?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonComponent)
  components?: LessonComponent[];

  @IsNotEmpty({ message: "Id danh mục không được để trống" })
  @IsNumber(undefined, { message: "Id danh mục phải là một số" })
  course_category_id: number;
}

export class MarkLessonAsCompletedDto {
  @IsNotEmpty({ message: "Id bài học không được để trống" })
  @IsNumber(undefined, { message: "Id bài học phải là một số" })
  lesson_id: number;

  @IsBoolean({ message: "isCompleted phải là một boolean" })
  @IsNotEmpty({ message: "isCompleted không được để trống" })
  isCompleted: boolean;
}

export class SwapOrderRequestDto {
  @IsNotEmpty({ message: "Id bài học không được để trống" })
  @IsNumber(undefined, { message: "Id bài học phải là một số" })
  lesson_id1: number;

  @IsNotEmpty({ message: "Id bài học không được để trống" })
  @IsNumber(undefined, { message: "Id bài học phải là một số" })
  lesson_id2: number;
}
