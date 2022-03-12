import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Like, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Chat } from '../chats/entities/chat.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Chat) private chats: Repository<Chat>,
    @InjectRepository(Activity) private activities: Repository<Activity>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
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
    return await this.activities.find({
      select: ['id', 'coordlieux', 'emoji'],
      relations: ['users'],
    });
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
    if (name == 'null' && lieux == 'null' && date == 'null') {
      return await this.activities.find({ relations: ['users'] });
    } else if (name != 'null' && lieux != 'null' && date == 'null') {
      return await this.activities.find({
        relations: ['users'],
        where: {
          name: Like('%' + name + '%'),
          lieux: Like('%' + lieux + '%'),
        },
      });
    } else if (name != 'null' && lieux == 'null' && date != 'null') {
      return await this.activities.find({
        relations: ['users'],
        where: {
          name: Like('%' + name + '%'),
          date: Like('%' + date + '%'),
        },
      });
    } else if (name == 'null' && lieux != 'null' && date != 'null') {
      return await this.activities.find({
        relations: ['users'],
        where: {
          lieux: Like('%' + lieux + '%'),
          date: Like('%' + date + '%'),
        },
      });
    } else if (name == 'null' && lieux == 'null' && date != 'null') {
      return await this.activities.find({
        relations: ['users'],
        where: {
          date: Like('%' + date + '%'),
        },
      });
    } else if (name == 'null' && lieux != 'null' && date == 'null') {
      return await this.activities.find({
        relations: ['users'],
        where: {
          lieux: Like('%' + lieux + '%'),
        },
      });
    } else if (name != 'null' && lieux == 'null' && date == 'null') {
      return await this.activities.find({
        relations: ['users'],
        where: {
          name: Like('%' + name + '%'),
        },
      });
    } else if (name != 'null' && lieux != 'null' && date != 'null') {
      return await this.activities.find({
        relations: ['users'],
        where: {
          name: Like('%' + name + '%'),
          lieux: Like('%' + lieux + '%'),
          date: Like('%' + date + '%'),
        },
      });
    }
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
      `SELECT activity.id,activity.name,activity.date,activity.description,activity.lieux,activity.creatorId,activity.coordlieux,activity.emoji,activity.nbMax 
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
