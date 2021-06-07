import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterPayload {
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  password: string;
}
