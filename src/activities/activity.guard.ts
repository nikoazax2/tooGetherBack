import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';

@Injectable()
export class ActivityGuard implements CanActivate {
  constructor(private activityService: ActivitiesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    let id = params.id;
    if (!id) {
      throw new NotFoundException('Activity not found');
    }

    return await this.activityService.doesUserCanSee(id, user);
  }
}
