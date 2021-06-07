import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
  ) {}

  create(createActivityDto: CreateActivityDto) {
    return this.activitiesRepository.save(createActivityDto);
  }

  findAll() {
    return this.activitiesRepository.find();
  }

  findOne(id: number) {
    return this.activitiesRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return this.activitiesRepository.update(id, updateActivityDto);
  }

  remove(id: number) {
    return this.activitiesRepository.delete(id);
  }
}
