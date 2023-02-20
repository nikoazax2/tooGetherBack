import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterPayload {
  @ApiProperty()
  email: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  uuid: string;

  @ApiProperty()
  avatar: string;
}
