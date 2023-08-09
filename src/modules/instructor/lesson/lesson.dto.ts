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
  @IsNumber(undefined, { message: "id bài học phải là một số" })
  id: number;

  @IsNotEmpty({ message: "Tiêu đề không được để trống" })
  @IsString({ message: "Tiêu đề phải là một chuỗi" })
  title: string;

  @IsString({ message: "Tóm tắt phải là một chuỗi" })
  summary?: string;

  @IsArray({
    message: "Các thành phần của bài học phải là một mảng",
  })
  @ValidateNested({ each: true })
  @Type(() => LessonComponent)
  components?: LessonComponent[];
}

export class AddLessonDto {
  @IsNumber(undefined, { message: "order phải là một số" })
  order: number;

  @IsNumber(undefined, { message: "section_id phải là một số" })
  section_id: number;
}

export class MarkLessonAsCompletedDto {
  @IsNotEmpty({ message: "Id bài học không được để trống" })
  @IsNumber(undefined, { message: "Id bài học phải là một số" })
  lesson_id: number;

  @IsBoolean({ message: "isCompleted phải là một boolean" })
  @IsNotEmpty({ message: "isCompleted không được để trống" })
  isCompleted: boolean;

  @IsNumber(undefined, { message: "course_id phải là một số" })
  course_id: number;
}

class SwapOrderRequestDto {
  @IsNotEmpty({ message: "Id bài học không được để trống" })
  @IsNumber(undefined, { message: "Id bài học phải là một số" })
  lesson_id1: number;

  @IsNotEmpty({ message: "Id bài học không được để trống" })
  @IsNumber(undefined, { message: "Id bài học phải là một số" })
  lesson_id2: number;
}

class UpdateLessonsOrder {
  lessons: {
    id: number;
    order: number;
  }[];
}
export { UpdateLessonsOrder, SwapOrderRequestDto };
