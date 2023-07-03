import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { ResponseDefault } from "../../../common/dto/response_default";
import { SectionService } from "./section.service";
import { CreateSectionDto, SwapOrderRequestDto, UpdateSectionDto } from "./dto/dto";

@Controller("admin/section")
export class SectionController {
  constructor(private sectionService: SectionService) {}

  @Post("/")
  async createCatCourse(@Body() body: CreateSectionDto) {
    return await this.sectionService.createSection(body);
  }

  @Patch("/:id")
  async updateCatCourse(@Body() body: UpdateSectionDto, @Param("id") id: number) {
    return await this.sectionService.updateSection(body.title, id);
  }

  @Post("/swap-order")
  async swapOrder(@Body() req: SwapOrderRequestDto) {
    const res = await this.sectionService.swapOrder(req.sectionId1, req.sectionId2);
    return new ResponseDefault("Order swapped successfully", res);
  }

  @Delete("/:id")
  async deleteCatCourse(@Param("id") id: number) {
    return await this.sectionService.deleteSection(id);
  }
}
