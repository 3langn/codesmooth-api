import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TagService } from "./tag.service";
import { CreateTagRequest } from "./tag.dto";
import { ResponseDefault } from "../../../common/dto/response_default";
import { PageDto } from "../../../common/dto/page.dto";
import { PageOptionsDto } from "../../../common/dto/page-options.dto";
import { PageMetaDto } from "../../../common/dto/page-meta.dto";

@Controller("admin/tag")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post("/")
  async createTag(@Body() req: CreateTagRequest) {
    const rs = await this.tagService.createTag(req);

    return new ResponseDefault(null, rs);
  }

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
