import { BaseDto } from "../../../../common/abstract.dto";
import { CategoryEntity } from "../../../../entities/category.entity";

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
  sections: any[];
  owner: Owner;
  is_bought: boolean;
  main_category: CategoryEntity;
}
export interface Owner {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}
