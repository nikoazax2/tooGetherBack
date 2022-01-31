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
import { ChatsService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
  @ApiTags('chats')
  @Get('/:id/chat')
  activityCreator(@Param('id') id: string) {
    return this.chatsService.findOneChat(+id);
  }

  @ApiTags('chats')
  @Get('/:idUser/chatList')
  listChat(@Param('idUser') idUser: string) {
    return this.chatsService.findListChat(+idUser);
  }

  @ApiTags('chats')
  @UseGuards(RolesGuard)
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() creatChatDto: CreateChatDto, @Param('userId') userId: string) {
    return this.chatsService.create(creatChatDto, +userId);
  }
}
