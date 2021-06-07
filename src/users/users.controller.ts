import {
  Controller,
  UseGuards,
  Request,
  Get,
  Param,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActivitiesService } from 'src/activities/activities.service';
import { RoleEnum } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private activitiesService: ActivitiesService,
  ) {}

  @ApiTags('users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return { user: req.user };
  }

  @ApiTags('users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('activities')
  activities(@Request() req) {
    return this.activitiesService.findFromUser(req.user.id);
  }

  @ApiTags('users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('activities/:id')
  addActivity(@Request() req, @Param('id') id: string) {
    return this.activitiesService.addUser(+id, req.user.id);
  }

  @ApiTags('users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('activities/:id')
  removeActivity(@Request() req, @Param('id') id: string) {
    return this.activitiesService.removeUser(+id, req.user.id);
  }

  @ApiTags('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.Admin)
  @Get('profile/:id')
  async getOne(@Param('id') id: string) {
    return (await this.usersService.getById(id)).getJSON();
  }

  @ApiTags('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.Admin)
  @Get('list')
  async list() {
    return (await this.usersService.getAll()).map((user) => user.getJSON());
  }
}
