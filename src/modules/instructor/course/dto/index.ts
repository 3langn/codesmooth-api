import { ArrayMinSize, IsIn, IsOptional } from "class-validator";
import { PageOptionsDto } from "../../../../common/dto/page-options.dto";
import { CourseStatus } from "../../../../common/enum/course";
import { NumberFieldOptional } from "../../../../decorators";

class InstructorGetCoursePageOptionsDto extends PageOptionsDto {
  @IsIn(["price", "created_at"], {
    message: "sort must be one of these values: price, created_at",
  })
  sort?: string;

  @IsOptional()
  @IsIn(Object.values(CourseStatus), {
    message: `status must be one of these values: ${Object.values(CourseStatus).join(", ")}`,
  })
  status?: CourseStatus;
}
export { InstructorGetCoursePageOptionsDto };
