import { ApiProperty } from '@nestjs/swagger';

export class UserLoginPayload {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
