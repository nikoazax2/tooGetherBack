import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import { Activity } from '../activities/entities/activity.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chats: Repository<Chat>,
    @InjectRepository(Activity) private activities: Repository<Activity>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}
  async findOneChat(id: number) {
    const chats = await this.chats
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.userId', 'user')
      .leftJoinAndSelect('chat.activityId', 'activity')
      .select([
        'chat.userId',
        'chat.message',
        'chat.date',
        'user.avatar',
        'user.surname',
      ])
      .andWhere('chat.activityId = ' + id)
      .execute();

    const activity = await this.activities
      .createQueryBuilder('activity')
      .select(['activity.name', 'activity.emoji'])
      .andWhere('activity.id = ' + id)
      .execute();

    const retour = { chats: chats, activity: activity };
    return retour;
  }

  async create(createChatDto: CreateChatDto, userId: number) {
    return await this.chats.save(createChatDto);
  }
}
