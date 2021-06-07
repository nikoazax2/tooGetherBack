import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Role } from '../roles/role.entity';
import { ActivitiesModule } from '../activities/activities.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), ActivitiesModule],

  exports: [UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
