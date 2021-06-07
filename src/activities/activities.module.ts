import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  imports: [TypeOrmModule.forFeature([Activity, User])],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
