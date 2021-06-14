import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterPayload {
  @ApiProperty()
  email: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  password: string;
}
