import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { LessonComponent } from "../../../entities/lession.entity";

export class CreateSampleDto {
  @IsNotEmptyObject()
  @Type(() => LessonComponent)
  sample: LessonComponent;

  @IsNotEmpty()
  @IsString()
  language: string;
}
