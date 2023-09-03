import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TagService } from "./tag.service";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageDto } from "../../common/dto/page.dto";
import { PageMetaDto } from "../../common/dto/page-meta.dto";

@Controller("tag")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get("/")
  async getTags(@Query() req: PageOptionsDto) {
    const [data, itemCount] = await this.tagService.getTags(req);

    return new PageDto(
      data,
      new PageMetaDto({
        itemCount,
        ...req,
      }),
    );
  }
}
