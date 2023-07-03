import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { LessonComponent } from "../../../entities/lesson.entity";

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  thumbnail: string;

  @IsNumber()
  order: number;
}

export class UpdateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  thumbnail: string;

  @IsNumber()
  order: number;

  @IsBoolean()
  is_active: boolean;
}
