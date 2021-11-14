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
    return await this.chats.find({
      select: ['id', 'message', 'date', 'userId'],
      where: { activityId: id },
    });
  }

  async create(createChatDto: CreateChatDto) {
    return await this.chats.save(createChatDto);
  }
}
