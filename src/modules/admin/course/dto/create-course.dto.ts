import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name must not be empty" })
  name: string;

  @IsNotEmpty({ message: "Description must not be empty" })
  @IsString({ message: "Description must be a string" })
  description: string;

  @IsNumber()
  price: number;

  // @IsNumber()
  // discount: number;

  @IsString()
  image: string;

  courseCategoryId?: number;
}
