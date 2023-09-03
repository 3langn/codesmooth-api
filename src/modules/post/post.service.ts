import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostComponentType, PostEntity } from "../../entities/post.entity";
import { In, Repository } from "typeorm";
import { CreatePostRequest, UpdatePostRequest } from "./post.dto";
import { TagEntity } from "../../entities/tag.entity";
import { CustomHttpException } from "../../common/exception/custom-http.exception";
import { StatusCodesList } from "../../common/constants/status-codes-list.constants";
import { PageOptionsDto } from "../../common/dto/page-options.dto";
import { queryPagination } from "../../common/utils";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity) private postRepo: Repository<PostEntity>,
    @InjectRepository(TagEntity) private tagRepo: Repository<TagEntity>,
  ) {}

  async getPostBySlug(slug: string) {
    const post = await this.postRepo
      .createQueryBuilder("post")
      .select([
        "post",
        "tags",
        "author.id",
        "author.username",
        "author.avatar",
        "author.title",
        "author.bio",
        "author.facebook_url",
        "author.twitter_url",
        "author.linkedin_url",
        "author.youtube_url",
      ])
      .leftJoinAndSelect("post.tags", "tags")
      .leftJoin("post.author", "author")
      .where("post.slug = :slug", { slug })
      .getOne();
    if (!post) {
      throw new CustomHttpException({
        message: "Không tồn tại bài viết",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return post;
  }

  async createPost(req: CreatePostRequest, user_id: number) {
    const tags = await this.findTagsByIds(req.tags_id);
    const post = this.postRepo.create({
      ...req,
      tags,
      author_id: user_id,
    });

    post.reading_time = this.calculateReadingTime(post);

    return await this.postRepo.save(post);
  }

  async updatePost(req: UpdatePostRequest, post_id: number, user_id: number) {
    const post = await this.postRepo.findOne({
      where: { id: post_id, author_id: user_id },
    });

    if (!post) {
      throw new CustomHttpException({
        message: "Không tồn tại bài viết",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const tags = await this.findTagsByIds(req.tags_id);

    post.title = req.title;
    post.summary = req.summary;
    post.thumbnail_url = req.thumbnail_url;
    post.thumbnail_style = req.thumbnail_style;
    post.components = req.components;
    post.tags = tags;
    post.reading_time = this.calculateReadingTime(post);
    post.meta_title = req.meta_title;
    post.slug = req.slug;
    post.title_color = req.title_color;

    return await this.postRepo.save(post);
  }

  private calculateReadingTime(post: PostEntity) {
    let total_read_time = 0;

    post.components.forEach((component) => {
      if (component.type === PostComponentType.TEXT) {
        const textContent = component.content.replace(/<[^>]+>/g, "");
        const words = textContent.split(/\s+/).filter((word) => word !== "").length;
        total_read_time += words / 200;
      }
      if (component.type === PostComponentType.IMAGE) {
        // total_read_time +=
      }
      if (component.type === PostComponentType.CODE) {
        total_read_time += 1;
      }
    });

    return total_read_time;
  }

  async getPosts(req: PageOptionsDto, user_id: number) {
    const qb = this.postRepo.createQueryBuilder("post");
    qb.select(["post", "tags", "author.id", "author.username", "author.avatar", "author.title"])
      .leftJoin("post.tags", "tags")
      .leftJoin("post.author", "author")
      .where("post.author_id = :user_id", { user_id });

    return queryPagination({
      query: qb,
      o: req,
    });
  }

  async findTagsByIds(tags_id: number[]) {
    const tags = await this.tagRepo.find({
      where: { id: In(tags_id) },
    });
    if (tags.length !== tags_id.length) {
      throw new CustomHttpException({
        message: "Không tồn tại tag",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return tags;
  }

  async suggestPost(slug: string) {
    const post = await this.postRepo.findOne({
      where: { slug },
      relations: ["tags"],
    });
    if (!post) {
      throw new CustomHttpException({
        message: "Không tồn tại bài viết",
        code: StatusCodesList.NotFound,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    const tags = post.tags.map((tag) => tag.id);

    const qb = this.postRepo
      .createQueryBuilder("post")
      .select(["post", "tags"])
      .leftJoin("post.tags", "tags")
      .where("tags.id IN (:...tags)", { tags })
      .andWhere("post.id != :post_id", { post_id: post.id });

    return queryPagination({
      query: qb,
      o: new PageOptionsDto({
        take: 10,
      }),
    });
  }

  async deletePost(id: number) {
    await this.postRepo.delete(id);
  }
}
