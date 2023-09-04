import { ArrayNotEmpty, IsNotEmpty, IsOptional } from "class-validator";
import { PageOptionsDto } from "../../common/dto/page-options.dto";

export class CreateOrUpdateSeriesRequest {
  @IsOptional()
  id?: number;

  @IsNotEmpty({ message: "name không được để trống" })
  name: string;

  @IsOptional()
  @ArrayNotEmpty({ message: "post_ids không được để trống" })
  post_ids?: number[];
}

export class GetPostsCanAddToSeriesQuery extends PageOptionsDto {
  @IsNotEmpty({ message: "series_id không được để trống" })
  series_id?: number;
}
