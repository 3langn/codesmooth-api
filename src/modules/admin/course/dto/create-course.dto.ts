import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
  @IsNumber({ maxDecimalPlaces: 18 }, { message: "Id must be a number" })
  id: number;

  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name must not be empty" })
  name: string;

  @IsNotEmpty({ message: "Summary must not be empty" })
  @IsString({ message: "Summary must be a string" })
  summary: string;

  @IsNumber()
  price: number;

  // @IsNumber()
  // discount: number;
  thumbnail: string;

  courseCategoryId?: number;
}
