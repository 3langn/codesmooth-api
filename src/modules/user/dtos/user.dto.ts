import { BaseDto } from "../../../common/abstract.dto";

export class UserDto extends BaseDto {
  username?: string;

  avatar?: string;

  bio?: string;

  facebook_url?: string;

  twitter_url?: string;

  linkedin_url?: string;

  youtube_url?: string;

  title?: string;

  isActive?: boolean;
}
