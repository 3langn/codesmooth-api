import { BaseDto } from "../../../common/abstract.dto";

export class UserDto extends BaseDto {
  firstName?: string;

  lastName?: string;

  // @ApiPropertyOptional({ enum: RoleType })
  // role: RoleType;

  email?: string;

  avatar?: string;

  phone?: string;

  isActive?: boolean;
}
