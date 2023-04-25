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
    constructor(private readonly activitiesService: ActivitiesService) { }

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
    @Get('/:name/:lieux/:date/recherche')
    getAllWParams(
        @Param('name') name: string,
        @Param('lieux') lieux: string,
        @Param('date') date: string,
    ) {
        return this.activitiesService.getAllWParams(name, lieux, date);
    }

    @ApiTags('activities')
    @Get('/:uuid/creator')
    activityCreator(@Param('uuid') uuid: string) {
        return this.activitiesService.findFromCreator(uuid);
    }

    @ApiTags('activities')
    @Get('/:idParticipant/participant')
    activityParticipant(@Param('idParticipant') idParticipant: string) {
        return this.activitiesService.findFromPaticipant(idParticipant);
    }

    @ApiTags('activities')
    @Get('/:idUser/activityOfUser')
    findFromUser(@Param('idUser') idUser: string) {
        return this.activitiesService.findFromUser(idUser);
    }

    @ApiTags('activities')
    @Get('/:id/detail')
    activityDetail(@Param('id') id: string) {
        return this.activitiesService.findOne(id);
    }

    @ApiTags('activities')
    @Get('/map/:coords')
    activityMap(@Param('coords') coords: string) {
        return this.activitiesService.findMap(coords);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiTags('activities')
    @UseGuards(RolesGuard)
    @Put(':uuid/user/:userUuid')
    addUser(@Param('uuid') uuid: string, @Param('userUuid') userUuid: string) {
        return this.activitiesService.addUser(uuid, userUuid);
    }

    @ApiTags('activities')
    @Patch(':uuid')
    update(
        @Param('uuid') uuid: string,
        @Body() updateActivityDto: UpdateActivityDto,
    ) {
        return this.activitiesService.update(uuid, updateActivityDto);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiTags('admin')
    @UseGuards(RolesGuard)
    @Roles(RoleEnum.Admin)
    @Delete(':uuid/user/:userUuid')
    removeUser(@Param('uuid') uuid: string, @Param('userUuid') userUuid: string) {
        return this.activitiesService.removeUser(uuid, userUuid);
    }

    @ApiTags('activities')
    @Delete(':uuid')
    remove(@Param('uuid') uuid: string) {
        return this.activitiesService.remove(uuid);
    }
}
