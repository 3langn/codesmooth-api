import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostRequest, UpdatePostRequest } from "./post.dto";
import { ResponseDefault } from "../../common/dto/response_default";
import { Auth, AuthUser } from "../../decorators";
import { UserEntity } from "../../entities/user.entity";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { PageDto } from "../../common/dto/page.dto";
import { PageMetaDto } from "../../common/dto/page-meta.dto";

@Controller("/post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Auth()
  @Post()
  async createPost(@Body() req: CreatePostRequest, @AuthUser() user: UserEntity) {
    const rs = await this.postService.createPost(req, user.id);

    return new ResponseDefault(null, rs);
  }

  @Get()
  async getPost(@Query() req: PageOptionsDto) {
    const [data, itemCount] = await this.postService.getPosts(req);
    return new PageDto(data, new PageMetaDto({ itemCount, ...req }));
  }

  @Auth()
  @Get("/my-posts")
  async getMyPost(@AuthUser() user: UserEntity, @Query() req: PageOptionsDto) {
    const [data, itemCount] = await this.postService.getMyPosts(req, user.id);
    return new PageDto(data, new PageMetaDto({ itemCount, ...req }));
  }

  @Get("/:slug")
  async getPostBySlug(@Param("slug") req: string) {
    const r = await this.postService.getPostBySlug(req);
    return new ResponseDefault(null, r);
  }

  @Auth()
  @Put("/:id")
  async updatePost(
    @Param("id") id: number,
    @Body() req: UpdatePostRequest,
    @AuthUser() user: UserEntity,
  ) {
    const r = await this.postService.updatePost(req, id, user.id);
    return new ResponseDefault(null, r);
  }

  @Get("/suggest/:slug")
  async suggestPost(@Param("slug") slug: string) {
    const [data, itemCount] = await this.postService.suggestPost(slug);
    return new PageDto(data, new PageMetaDto({ itemCount }));
  }

  @Delete("/:id")
  async deletePost(@Param("id") id: number) {
    await this.postService.deletePost(id);
    return new ResponseDefault("Success");
  }
}
