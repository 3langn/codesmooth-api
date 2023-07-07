import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SaveCourseDto {
  // @IsNumber({ maxDecimalPlaces: 18 }, { message: "Id must be a number" })
  // id: number;

  @IsString({ message: "Name must be a string" })
  @IsNotEmpty({ message: "Name must not be empty" })
  name: string;

  @IsNotEmpty({ message: "Description must not be empty" })
  @IsString({ message: "Description must be a string" })
  description: string;

  @IsString({ message: "Short description must be a string" })
  @IsNotEmpty({ message: "Short description must not be empty" })
  short_description: string;

  @IsNumber()
  price: number;

  // @IsArray({ message: "Will learn must be an array" })
  // will_learns: string[];

  // @IsArray({ message: "Skills must be an array" })
  // skills: string[];

  @IsArray({ message: "Category id must be an array" })
  category_ids: number[];

  @IsString({ message: "Target audience must be a string" })
  target_audience: string;

  @IsArray({ message: "Requirements must be an array" })
  requirements: string[];

  @IsString({ message: "Feedback Email must be a string" })
  feedback_email: string;

  @IsString({ message: "Thumbnail must be a string" })
  thumbnail: string;
}
