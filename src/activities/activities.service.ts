import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Like, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Chat } from '../chats/entities/chat.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Chat) private chats: Repository<Chat>,
    @InjectRepository(Activity) private activities: Repository<Activity>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
      createActivityDto.uuid = uuidv4().replace(/-/g, ''); 
      console.log(createActivityDto);
    return await this.activities.save(createActivityDto);
  }

  async findAll() {
    const activities = await this.activities
      .createQueryBuilder('activity')
      .orderBy('activity.date', 'ASC')
      .execute();

    return activities;
  }

  async findMap() {
    const entityManager = getManager();
    const lieux = await entityManager.query(
      `SELECT
      activity.id as 'id',
      activity.coordlieux as 'coordlieux',
      activity.emoji as 'emoji',
      (
         SELECT
             JSON_ARRAYAGG(
                 JSON_OBJECT(
                     'id', user.id,
                     'email', user.email,
                     'avatar', user.avatar,
                     'profileImage', user.profileImage,
                     'username', user.surname
                 )
             )
         FROM activity_users_user
         LEFT JOIN user ON activity_users_user.userId = user.id
         WHERE activity_users_user.activityId = activity.id
         ) as users
        FROM activity 
        ORDER BY activity.date DESC
        LIMIT 50`,
    ); 

    return lieux;
  }

  async findOne(id: number) {
    return await this.activities.findOne({
      select: [
        'id',
        'name',
        'lieux',
        'date',
        'description',
        'coordlieux',
        'creatorId',
        'emoji',
      ],
      relations: ['users'],
      where: { id: id },
    });
  }

  async getAllWParams(name: string, lieux: string, date: string) {
    const entityManager = getManager();
    name == 'null' ? (name = null) : '';
    lieux == 'null' ? (lieux = null) : '';
    date == 'null' ? (date = null) : '';

    let nameSQL = name ? `activity.name like '%${name}%'` : '';
    let lieuxSQL = lieux ? `activity.lieux like '%${lieux}%'` : '';
    let dateSQL = date ? `activity.date like '%${date}%'` : '';

    let where = '';
    if (name && lieux && date) {
      where = `where ${nameSQL} and ${lieuxSQL} and ${dateSQL}  and activity.date > NOW()`;
    } else if (name && lieux) {
      where = `where ${lieuxSQL} and ${nameSQL}  and activity.date > NOW()`;
    } else if (name && date) {
      where = `where ${dateSQL} and ${nameSQL}  and activity.date > NOW()`;
    } else if (date && lieux) {
      where = `where ${lieuxSQL} and ${dateSQL}  and activity.date > NOW()`;
    } else if (nameSQL || lieuxSQL || dateSQL) {
      where = `where ${nameSQL} ${lieuxSQL} ${dateSQL} and activity.date > NOW()`;
    }  else {
        where = 'WHERE activity.date > NOW()'
    }
    
    const activitys = await entityManager.query(
      `SELECT
      activity.id as 'id',
      activity.name as 'name',
      activity.description as 'description',
      activity.date as 'date',
      activity.lieux as 'lieux',
      activity.creatorId as 'creatorId',
      activity.coordlieux as 'coordlieux',
      activity.emoji as 'emoji',
      activity.nbMax as 'nbMax',
      (
         SELECT
             JSON_ARRAYAGG(
                 JSON_OBJECT(
                        'usr_id', user.id,
                     'email', user.email,
                     'avatar', user.avatar,
                     'profileImage', user.profileImage,
                     'username', user.surname
                 )
             )
         FROM activity_users_user
         LEFT JOIN user ON activity_users_user.userId = user.id
         WHERE activity_users_user.activityId = activity.id
         ) as users
        FROM activity
        ${where}
        ORDER BY activity.date DESC
        LIMIT 10`,
    ); 
    return activitys;
  }

  async findFromCreator(userId: string) {
    return await this.activities.find({
      relations: ['users'],
      where: { creatorId: userId },
    });
  }

  async findFromPaticipant(UserIdPaticipant: number) {
    const entityManager = getManager();

    const activitys = await entityManager.query(
      `SELECT act.id as act_id,act.name,act.description,act.date,act.lieux,act.creatorId,act.coordlieux,act.emoji,act.nbMax,usr.id as usr_id,usr.email,usr.surname,usr.avatar,usr.profileImage from activity act 
      JOIN activity_users_user act_usr on act.id = act_usr.activityId
      JOIN user usr on usr.id = act_usr.userId
      where usr.id = '${UserIdPaticipant}'
      ORDER by act.date desc`,
    );
    for (let index = 0; index < activitys.length; index++) {
      let users = await entityManager.query(
        `select usr.id,usr.avatar,usr.profileImage,usr.surname from user usr
        JOIN activity_users_user act_usr on usr.id = act_usr.userId
        JOIN activity act on act.id = act_usr.activityId
        where act.id='${activitys[index].act_id}'`,
      );
      activitys[index].users = users;
      console.log('index:' + index);
      console.log('lenght: ' + activitys.length);
      if (index == activitys.length - 1) {
        return activitys;
      }
    }
    console.log(activitys);
  }

  async findFromUser(userId: number) {
    const entityManager = getManager();
    const activity = await entityManager.query(
      `SELECT activity.id,activity.uuid,activity.name,activity.date,activity.description,activity.lieux,activity.creatorId,activity.coordlieux,activity.emoji,activity.nbMax 
      FROM activity join activity_users_user on activityId = activity.id 
      join user on userId = user.id 
      where userId='${userId}' 
      order by activity.date`,
    );
    return activity;
  }

  async addUser(id: number, userId: number) {
    let activity = await this.activities.findOne({
      relations: ['users'],
      where: { id: id },
    });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    let user = await this.users.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    activity.users.push(user);
    activity.save();
    return true;
  }

  async removeUser(id: number, userId: number) {
    let activity = await this.activities.findOne({
      relations: ['users'],
      where: { id: id },
    });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    let user = await this.users.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    activity.users.splice(activity.users.indexOf(user), 1);
    activity.save();
    return true;
  }

  async update(id: number, updateActivitytDto: UpdateActivityDto) {
    await this.activities.update(id, updateActivitytDto);
  }

  async remove(id: number) {
    await this.activities.delete(id);
  }
}
