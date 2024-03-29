import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';

export class CreateActivityDto {
    @ApiProperty()
    creatorId: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    lieux: string;

    @ApiProperty()
    coordlieux: string;

    @ApiProperty()
    lat: string;
  
    @ApiProperty()
    lng: string;

    @ApiProperty()
    date: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    emoji: string;

    @ApiProperty()
    nbMax: string;
}
