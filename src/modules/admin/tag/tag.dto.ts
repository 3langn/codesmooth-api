import { ArrayNotEmpty, IsNotEmpty } from "class-validator";
import { PostComponent } from "../../../entities/post.entity";

export class CreateTagRequest {
  @IsNotEmpty({ message: "title không được để trống" })
  title: string;

  @IsNotEmpty({ message: "slug không được để trống" })
  slug: string;

  @IsNotEmpty({ message: "meta_title không được để trống" })
  meta_title: string;

  @IsNotEmpty({ message: "content không được để trống" })
  content: string;
}
