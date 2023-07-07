import { BaseDto } from "../../../common/abstract.dto";

export class CourseReponseDto extends BaseDto {
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
}
