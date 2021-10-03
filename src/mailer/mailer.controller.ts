import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EnvoiMail } from './mailer.service';
import { CreateMailerDto } from './dto/create-mailer.dto';
import { UpdateMailerDto } from './dto/update-mailer.dto';
import { RolesGuard } from '../roles/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: EnvoiMail) {}

  @ApiTags('mailer')
  @Get()
  mailsend() {
    return this.mailerService.envoielemail();
  }

  @ApiTags('mailer')
  @Get()
  findAll() {
    return this.mailerService.findAll();
  }
}
