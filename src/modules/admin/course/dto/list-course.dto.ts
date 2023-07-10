import { IsEnum, IsOptional } from "class-validator";
import { PageOptionsDto } from "../../../../common/dto/page-options.dto";
import { CourseStatus } from "../../../../common/enum/course";

export class ListCourseQueryDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(CourseStatus, { message: "status is invalid" })
  status?: CourseStatus;
  category_id?: number;
  owner_id?: number;
  name?: string;
}
