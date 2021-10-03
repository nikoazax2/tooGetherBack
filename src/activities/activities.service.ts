import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity) private activities: Repository<Activity>,
    @InjectRepository(Activity) private creator: Repository<Activity>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async create(createActivityDto: CreateActivityDto) {
    return await this.activities.save(createActivityDto);
  }

  async findAll() {
    return await this.activities.find();
  }

  async getAllWParams(name: string, lieux: string) {
    if (name != 'null') {
      return await this.activities.find({
        where: {
          name: Like('%' + name + '%'),
        },
      });
    }
    if (lieux != 'null') {
      return await this.activities.find({
        where: {
          lieux: Like('%' + lieux + '%'),
        },
      });
    }
    if (name != 'null' && lieux != 'null') {
      return await this.activities.find({
        where: {
          lieux: Like('%' + lieux + '%'),
          name: Like('%' + name + '%'),
        },
      });
    }
    if (name == 'null' && lieux == 'null') {
      return await this.activities.find();
    }
  }

  async findFromCreator(userId: string) {
    return await this.activities.find({
      select: ['id', 'name', 'date', 'description'],
      where: { creatorId: userId },
    });
  }

  async findOne(id: number) {
    return await this.activities.findOne({
      select: ['id', 'name', 'date', 'description'],
      relations: ['participants'],
      where: { id: id },
    });
  }

  async findFromUser(userId: number) {
    return await this.activities.find({
      select: ['id', 'name', 'date', 'description'],
      where: { creatorId: userId },
    });
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
