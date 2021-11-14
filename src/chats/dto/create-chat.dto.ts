import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

export class CreateChatDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  activityId: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  date: string;
}
