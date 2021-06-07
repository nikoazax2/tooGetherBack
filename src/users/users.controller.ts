import { Controller, UseGuards, Request, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActivitiesService } from 'src/activities/activities.service';
import { RoleEnum } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return { user: req.user };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('activities')
  activities(@Request() req) {
    return this.activitiesService.findFromUser(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.Admin)
  @Get('profile/:id')
  async getOne(@Param('id') id: string) {
    return (await this.usersService.getById(id)).getJSON();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.Admin)
  @Get('list')
  async list() {
    return (await this.usersService.getAll()).map((user) => user.getJSON());
  }
}
