import {
  Controller,
  UseGuards,
  Request,
  Get,
  Param,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  Body,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Observable, of } from 'rxjs';
import { ActivitiesService } from 'src/activities/activities.service';
import { RoleEnum } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { User } from './user.entity';
import { request } from 'http';
import { getManager } from 'typeorm';
import { editFileName } from './utils/file-upload.utils';
import { UpdateUserDto } from './dto/update-user.dto';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

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
  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, UpdateUserDto);
  }

  @ApiTags('users')
  @Get('checkMail/:mail')
  checkMail(@Param('mail') mail: string) {
    return this.usersService.checkMail(mail);
  }

  @ApiTags('users')
  @Get('profileImage/:path')
  profileImage(@Res() res, @Param('path') path: string) {
    if (path != 'null') {
      res.sendFile(path, {
        root: './uploads/profileimages',
      });
    } else {
      return null;
    }
  }

  @ApiTags('users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('addFriend')
  addFriend(@Request() req) {
    return this.usersService.addFriend(req.body.idUser, req.body.idFriend);
  }
  @ApiTags('users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('suppFriend')
  suppFriend(@Request() req) {
    return this.usersService.suppFriend(req.body.idUser, req.body.idFriend);
  }

  @ApiTags('users')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('getFriends/:id')
  getFriends(@Request() req, @Param('id') id: string) {
    return this.usersService.getFriends(id);
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
  @Get('profile/:id/:idUserConnected')
  async getOne(
    @Param('id') id: string,
    @Param('idUserConnected') idUserConnected: string,
  ) {
    let profilUser = (await this.usersService.getById(id)).getJSON();
    let friends = await this.usersService.isFriend(idUserConnected);

    let friend = false;
    friends.forEach((lefriend) => {
      lefriend.userId_2 == id ? (friend = true) : '';
    });

    return { profilUser, friend };
  }

  @ApiTags('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.Admin)
  @Get('list')
  async list(@Param('email') email: string) {
    return (await this.usersService.getAll(email)).map((user) =>
      user.getJSON(),
    );
  }

  @ApiTags('users')
  @ApiBearerAuth()
  @Get('testmailexist')
  async textmailexist(@Param('mail') mail: string) {
    return (await this.usersService.testmail(mail)).map((user) =>
      user.getJSON(),
    );
  }

  @ApiTags('users')
  @Post('profileImage')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profileimages',
        filename: editFileName,
      }),
    }),
  )
  async addAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
