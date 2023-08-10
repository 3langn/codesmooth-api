import { IsNumber, IsString, Length, Max, Min } from "class-validator";

export class ReviewCourseRequest {
  @IsNumber(undefined, {
    message: "course_id phải là số",
  })
  course_id: number;

  @IsString({
    message: "comment phải là string",
  })
  @Length(1, 200, {
    message: "comment phải có độ dài từ 1 đến 500 kí tự",
  })
  comment: string;

  @Min(1)
  @Max(5)
  @IsNumber()
  rating: number;
}
