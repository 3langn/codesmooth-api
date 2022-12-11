import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { LessonComponent } from "../../../entities/lession.entity";

export class CreateLessionDto {
  @IsNotEmpty({ message: "Tiêu đề không được để trống" })
  @IsString({ message: "Tiêu đề phải là một chuỗi" })
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonComponent)
  components?: LessonComponent[];

  @IsNotEmpty({ message: "Id danh mục không được để trống" })
  @IsNumber(undefined, { message: "Id danh mục phải là một số" })
  course_category_id: number;
}
