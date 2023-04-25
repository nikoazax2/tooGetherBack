import { ApiProperty } from '@nestjs/swagger';
import { Activity } from 'src/activities/entities/activity.entity';
import { User } from 'src/users/user.entity';
import { JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

export class CreateChatDto {
    @ApiProperty()
    message: string;

    @ApiProperty()
    date: string;

}
