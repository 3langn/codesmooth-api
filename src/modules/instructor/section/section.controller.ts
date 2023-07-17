import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { CreateSectionDto } from "./section.dto";
import { SectionService } from "./section.service";
import { ResponseDefault } from "../../../common/dto/response_default";
import { Auth } from "../../../decorators";

@Controller("instructor/section")
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @Auth()
  @Post("/")
  async createSection(@Body() body: CreateSectionDto, @Req() req: any) {
    await this.sectionService.createSection(body, req.user.id);
    return new ResponseDefault("Section created successfully");
  }

  @Auth()
  @Get("/:course_id")
  async getSection(@Param("course_id") course_id: number, @Req() req: any) {
    return new ResponseDefault(
      "success",
      await this.sectionService.getSections(course_id, req.user.id),
    );
  }

  @Auth()
  @Post("/:course_id/:order")
  async addSection(
    @Param("course_id") course_id: number,
    @Param("order") order: number,
    @Req() req: any,
  ) {
    return new ResponseDefault(
      "success",
      await this.sectionService.addSection(course_id, order, req.user.id),
    );
  }

  @Auth()
  @Delete("/:section_id")
  async deleteSection(@Param("section_id") section_id: number, @Req() req: any) {
    return new ResponseDefault(
      "success",
      await this.sectionService.deleteSection(section_id, req.user.id),
    );
  }

  @Auth()
  @Patch("/:section_id")
  async updateSection(
    @Param("section_id") section_id: number,
    @Body("title")
    title: string,
    @Req() req: any,
  ) {
    return new ResponseDefault(
      "success",
      await this.sectionService.updateSection(section_id, title, req.user.id),
    );
  }
}
