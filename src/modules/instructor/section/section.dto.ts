import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { LessonComponent } from "../../../entities/lesson.entity";

export class CreateSectionDto {
  course_id: number;
  order: number;
}
