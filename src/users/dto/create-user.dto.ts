import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  surname: string;

  @ApiProperty()
  interests: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  profileImage: string;

  
}
