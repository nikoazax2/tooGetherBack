import { Module } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailerController } from './mailer.controller';

@Module({
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
