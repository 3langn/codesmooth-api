import { Controller, Get, Param, Req } from "@nestjs/common";
import { SectionService } from "./section.service";
import { ResponseDefault } from "../../../common/dto/response_default";
import { UserRole } from "../../../common/enum/user-role";
import { Auth } from "../../../decorators";

@Controller("admin/section")
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @Auth([UserRole.ADMINSTRATOR])
  @Get("/:course_id")
  async getSections(@Param("course_id") course_id: number) {
    return new ResponseDefault(
      "success",
      await this.sectionService.getSectionsWithLesson(course_id),
    );
  }
}
