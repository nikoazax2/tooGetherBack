import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

export class CreateActivityDto {
  @ApiProperty()
  creator: User;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  lieux: string;

  @ApiProperty()
  date: string;
}
