import {
    Controller,
    Get,
    Request,
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
    constructor(private readonly chatsService: ChatsService) { }
    @ApiTags('chats')
    @Post('/chat')
    activityCreator(@Request() req) {
        return this.chatsService.findOneChat(req.body.uuid, req.body.page, req.body.uuiduser, req.body.uuiduser2);
    }

    @ApiTags('chats')
    @Get('/:idUser/chatList')
    listChat(@Param('idUser') idUser: string) {
        return this.chatsService.findListChat(idUser);
    }

    @ApiTags('chats')
    @UseGuards(RolesGuard)
    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    create(@Body() creatChatDto: CreateChatDto, @Param('userUuid') userUuid: string, @Param('userUuid2') userUuid2: string) {
        return this.chatsService.create(creatChatDto, userUuid, userUuid2);
    }
}
