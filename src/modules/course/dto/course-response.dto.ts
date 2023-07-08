import { BaseDto } from "../../../common/abstract.dto";
import { CourseEntity } from "../../../entities/course.entity";

export class CourseReponseDto extends BaseDto {
  name: string;
  description: string;
  short_description: string;
  price: number;
  base_price: number;
  target_audience: string;
  requirements: any[];
  thumbnail: string;
  status: string;
  owner_id: number;
  feedback_email: string;
  total_enrollment: number;
  categories: any[];
  owner: Owner;
  is_bought: boolean;
}
export interface Owner {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}
