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
    ) { }
    async findOneChat(uuid: string, page: number, uuiduser: string, uuiduser2: string) {
        const entityManager = getManager()
        //CHAT ACTIVITY
        if (uuid) {
            let chats = await entityManager.query(
                `select ch.userUuid as userUuid,ch.message as chat_message,ch.date as chat_date,us.avatar as user_avatar,
        us.surname as user_surname,us.profileImage as user_profileImage,us.avatar as user_avatar, ch.uuid
          FROM chat ch
          LEFT join user us on ch.userUuid = us.uuid
          left join activity act on ch.uuid = act.uuid
          where ch.activityUuid = "`+ uuid + `"
          order by chat_date desc limit 20 offset ${page * 20 - 20}`)

            chats = chats.reverse()

            const activity = await this.activities
                .createQueryBuilder('activity')
                .select(['activity.uuid, activity.name', 'activity.emoji'])
                .andWhere('activity.uuid = "' + uuid + '"')
                .execute()

            const retour = { chats: chats, activity: activity }
            return retour
        }
        else if (uuiduser && uuiduser2) {
            let chats = await entityManager.query(
                `select ch.userUuid as userUuid,ch.message as chat_message,ch.date as chat_date,us.avatar as user_avatar,
        us.surname as user_surname,us.profileImage as user_profileImage,us.avatar as user_avatar, ch.uuid
          FROM chat ch
          LEFT join user us on ch.userUuid = us.uuid
          left join activity act on ch.uuid = act.uuid
          where (ch.userUuid = "`+ uuiduser + `" and
          ch.userUuid2 = "`+ uuiduser2 + `") or (ch.userUuid = "` + uuiduser2 + `" and
          ch.userUuid2 = "`+ uuiduser + `") 
          order by chat_date desc limit 20 offset ${page * 20 - 20}`)
            chats = chats.reverse()
            const retour = { chats: chats }
            return retour
        }
    }

    async findListChat(id: string) {
        const chats = await this.chats
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.userUuid', 'user')
            .leftJoinAndSelect('chat.activityUuid', 'activity')
            .distinctOn(['activity.uuid'])
            .orderBy('chat.date', 'ASC')
            .andWhere('user.uuid = "' + id + '"')
            .limit(1)
            .execute();

        return chats;
    }

    async create(createChatDto: CreateChatDto, userUuid: string, userUuid2: string) {
        return await this.chats.save(createChatDto);
    }
}
