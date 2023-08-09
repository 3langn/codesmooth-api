import { Controller, Get, Param, Req } from "@nestjs/common";
import { SectionService } from "./section.service";
import { Auth } from "../../decorators";
import { ResponseDefault } from "../../common/dto/response_default";

@Controller("section")
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @Auth([], { public: true })
  @Get("/:course_id")
  async getSections(@Param("course_id") course_id: number, @Req() req: any) {
    return new ResponseDefault(
      "success",
      await this.sectionService.getSectionsWithLesson(course_id, req.user?.id),
    );
  }
}
