import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
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
    return await this.activities.find();
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
    const lesactivity = await this.activities.find({
      relations: ['users'],
    });
    var lesActivitesARenvoyer = [];
    //return lesactivity;
    lesactivity.forEach((activite) => {
      activite.users.forEach((user) => {
        if (
          user.id == UserIdPaticipant &&
          activite.creatorId != UserIdPaticipant.toString()
        ) {
          lesActivitesARenvoyer.push(activite);
        }
      });
    });
    return lesActivitesARenvoyer;
  }

  async findFromUser(userId: number) {
    const lesactivity = await this.activities.find({
      relations: ['users'],
    });
    var lesActivitesARenvoyer = [];
    //return lesactivity;
    lesactivity.forEach((activite) => {
      activite.users.forEach((user) => {
        if (user.id == userId) {
          lesActivitesARenvoyer.push(activite);
        }
      });
    });
    return lesActivitesARenvoyer;
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
