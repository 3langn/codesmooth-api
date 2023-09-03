import { ArrayNotEmpty, IsNotEmpty } from "class-validator";
import { PostComponent } from "../../entities/post.entity";
import { Optional } from "@nestjs/common";

export class CreatePostRequest {
  @IsNotEmpty({ message: "title không được để trống" })
  title: string;

  @IsNotEmpty({ message: "slug không được để trống" })
  slug: string;

  @IsNotEmpty({ message: "meta_title không được để trống" })
  meta_title: string;

  @IsNotEmpty({ message: "summary không được để trống" })
  summary: string;

  @IsNotEmpty({ message: "thumbnail_url không được để trống" })
  thumbnail_url: string;

  @IsNotEmpty({ message: "thumbnail_style không được để trống" })
  thumbnail_style: number;

  @ArrayNotEmpty({ message: "components không được để trống" })
  components: PostComponent[];

  @ArrayNotEmpty({ message: "tags_id không được để trống" })
  tags_id: number[];

  @IsNotEmpty({ message: "title_color không được để trống" })
  title_color: string;
}

export class UpdatePostRequest {
  @Optional()
  @IsNotEmpty({ message: "title không được để trống" })
  title: string;

  @Optional()
  @IsNotEmpty({ message: "slug không được để trống" })
  slug: string;

  @Optional()
  @IsNotEmpty({ message: "meta_title không được để trống" })
  meta_title: string;

  @Optional()
  @IsNotEmpty({ message: "summary không được để trống" })
  summary: string;

  @Optional()
  @IsNotEmpty({ message: "thumbnail_url không được để trống" })
  thumbnail_url: string;

  @Optional()
  @IsNotEmpty({ message: "thumbnail_style không được để trống" })
  thumbnail_style: number;

  @Optional()
  @ArrayNotEmpty({ message: "components không được để trống" })
  components: PostComponent[];

  @Optional()
  @ArrayNotEmpty({ message: "tags_id không được để trống" })
  tags_id: number[];

  @Optional()
  @IsNotEmpty({ message: "title_color không được để trống" })
  title_color: string;
}
