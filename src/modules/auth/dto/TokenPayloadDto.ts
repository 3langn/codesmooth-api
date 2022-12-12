import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadDto {
  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  constructor(data: {
    expiresIn: number;
    accessToken: string;
    refreshToken: string;
  }) {
    this.expiresIn = data.expiresIn;
    this.access_token = data.accessToken;
    this.refresh_token = data.refreshToken;
  }
}
