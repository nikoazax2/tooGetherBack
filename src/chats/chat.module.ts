import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/activities/entities/activity.entity';
import { User } from '../users/user.entity';
import { ChatsController } from './chat.controller';
import { ChatsService } from './chat.service';
import { Chat } from './entities/chat.entity';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  imports: [TypeOrmModule.forFeature([Chat, User, Activity])],
  exports: [ChatsService],
})
export class ChatsModule {}
