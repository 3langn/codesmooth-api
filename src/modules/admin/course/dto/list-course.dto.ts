import { PageOptionsDto } from "../../../../common/dto/page-options.dto";
import { CourseStatus } from "../../../../common/enum/course";

export class ListCourseQueryDto extends PageOptionsDto {
  status?: CourseStatus;
  category_id?: number;
  owner_id?: number;
  name?: string;
}
