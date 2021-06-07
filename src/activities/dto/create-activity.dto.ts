import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty()
  name: string;
}
