import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity) private activities: Repository<Activity>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    return await this.activities.save(createActivityDto);
  }

  async findAll() {
    return await this.activities.find();
  }

  async findWithparticipants(id: number) {
    return await this.activities.findOne({
      relations: ['participants'],
      where: { id: id },
    });
  }

  async findOne(id: number) {
    return await this.activities.findOne({
      where: { id: id },
    });
  }

  async findFromUser(userId: number) {
    let activities = await this.activities.find({
      relations: ['participants'], // participants = users
    });

    let valids = [];

    for (const activity of activities) {
      for (const user of activity.participants) {
        if (userId === user.id) {
          let { participants, ...activity2 } = activity;
          valids.push(activity2);
          continue;
        }
      }
    }

    return valids;
  }

  async addUser(id: number, userId: number) {
    let activity = await this.activities.findOne({
      relations: ['participants'],
      where: { id: id },
    });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    let user = await this.users.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    activity.participants.push(user);
    activity.save();
    return true;
  }

  async removeUser(id: number, userId: number) {
    let activity = await this.activities.findOne({
      relations: ['participants'],
      where: { id: id },
    });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }
    let user = await this.users.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    activity.participants.splice(activity.participants.indexOf(user), 1);
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
