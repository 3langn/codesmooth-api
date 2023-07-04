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

export class SaveSettingDto {
  @IsString()
  key: string;

  @IsString()
  title: string;

  value: any;
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
