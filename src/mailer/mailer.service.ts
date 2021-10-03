import { Injectable } from '@nestjs/common';
import { CreateMailerDto } from './dto/create-mailer.dto';
import { UpdateMailerDto } from './dto/update-mailer.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateActivityDto } from 'src/activities/dto/create-activity.dto';

@Injectable()
export class EnvoiMail {
  activities: any;
  constructor(private readonly mailerService: MailerService) {}

  public envoielemail(): string {
    this.mailerService
      .sendMail({
        to: 'test@nestjs.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {
        return '';
      })
      .catch(() => {
        return '';
      });
    return '';
  }
  public findAll(): string {
    this.mailerService
      .sendMail({
        to: 'test@nestjs.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {
        return '';
      })
      .catch(() => {
        return '';
      });
    return '';
  }
  async create(createActivityDto: CreateActivityDto) {
    return await this.activities.save(createActivityDto);
  }
}
