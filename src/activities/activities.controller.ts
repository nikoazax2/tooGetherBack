import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleEnum } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @ApiTags('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.Admin)
  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @ApiTags('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.Admin)
  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @ApiTags('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.Admin)
  @Get('user/:userId')
  findFromUser(@Param('userId') id: string) {
    return this.activitiesService.findFromUser(+id);
  }

  @ApiTags('activities')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }

  @ApiTags('activities')
  @Get(':id/detail')
  findOneWithDetail(@Param('id') id: string) {
    return this.activitiesService.findWithparticipants(+id);
  }

  @ApiTags('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.Admin)
  @Put(':id/user/:userId')
  addUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.activitiesService.addUser(+id, +userId);
  }

  @ApiTags('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.Admin)
  @Delete(':id/user/:userId')
  removeUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.activitiesService.removeUser(+id, +userId);
  }

  @ApiTags('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.Admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(+id, updateActivityDto);
  }

  @ApiTags('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(+id);
  }
}
