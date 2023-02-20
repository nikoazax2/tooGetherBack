import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Like, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Chat } from './entities/chat.entity';
import { Activity } from '../activities/entities/activity.entity';
import { uuid } from 'uuid';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat) private chats: Repository<Chat>,
    @InjectRepository(Activity) private activities: Repository<Activity>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}
  async findOneChat(uuid: string) {
    const entityManager = getManager()
    
    let chats = await entityManager.query(
      `select ch.userId as userId,ch.message as chat_message,ch.date as chat_date,us.avatar as user_avatar,us.surname as user_surname, ch.uuid
          FROM chat ch
          LEFT join user us on ch.userId = us.id 
          left join activity act on ch.uuid = act.uuid
          where ch.uuid = "`+uuid+`"
          order by chat_date desc limit 20`)
          
    chats = chats.reverse()

    const activity = await this.activities
      .createQueryBuilder('activity')
      .select(['activity.id, activity.name', 'activity.emoji'])
      .andWhere('activity.uuid = "' + uuid+'"')
      .execute()

    const retour = { chats: chats, activity: activity }
    return retour
  }

  async findListChat(id: number) {
    const chats = await this.chats
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.userId', 'user')
      .leftJoinAndSelect('chat.activityId', 'activity')
      .distinctOn(['activity.id'])
      .orderBy('chat.date', 'ASC')
      .andWhere('user.id = ' + id)
      .limit(1)
      .execute();
    /* .createQueryBuilder('activity')
      .distinctOn(['activity.activityId'])
      .innerJoin(User, 'user', 'user.id = activity.userId')
      .andWhere('user.id = ' + id)
      .execute(); */

    return chats;
  }

  async create(createChatDto: CreateChatDto, userId: number) {
    return await this.chats.save(createChatDto);
  }
}
