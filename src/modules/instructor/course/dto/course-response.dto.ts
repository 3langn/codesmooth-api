import { BaseDto } from "../../../../common/abstract.dto";
import { UserDto } from "../../../user/dtos/user.dto";

export class InstructorCourseReponseDto extends BaseDto {
  name: string;
  description: string;
  short_description: string;
  price: number;
  // skills: string[];
  target_audience: string;
  requirements: string[];
  thumbnail: string;
  status: string;
  owner_id: number;
  review_count: number;
}
