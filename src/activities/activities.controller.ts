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
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @ApiTags('activities')
  @UseGuards(RolesGuard)
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @ApiTags('activities')
  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @ApiTags('activities')
  @Get('/:name/:lieux')
  getAllWParams(@Param('name') name: string, @Param('lieux') lieux: string) {
    return this.activitiesService.getAllWParams(name, lieux);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('activities')
  @UseGuards(RolesGuard)
  @Get('creator/:userId')
  findFromCreator(@Param('userId') id: string) {
    return this.activitiesService.findFromCreator(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('activities')
  @UseGuards(RolesGuard)
  @Get('user/:userId')
  findFromUser(@Param('userId') id: string) {
    return this.activitiesService.findFromCreator(id);
  }

  @ApiTags('activities')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('activities')
  @UseGuards(RolesGuard)
  @Put(':id/user/:userId')
  addUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.activitiesService.addUser(+id, +userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.Admin)
  @Delete(':id/user/:userId')
  removeUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.activitiesService.removeUser(+id, +userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags('admin')
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(+id);
  }
}
