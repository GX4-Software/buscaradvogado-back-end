import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import Handlebars from 'handlebars';
import { MagicLinkTemplate } from '../../commons/emals/magic-link.template';
@Injectable()
export class EmailService {
  constructor(@InjectQueue('email') private readonly mailQueue: Queue) {}

  async sendEmail(to: string, subject: string, template: string) {
    await this.mailQueue.add('send-email', {
      to,
      subject,
      template,
    });
  }

  async sendMagicLinkEmail(to: string, userName: string, magicLink: string) {
    const template = Handlebars.compile(MagicLinkTemplate);
    const html = template({
      userName,
      magicLink,
    });

    await this.sendEmail(to, 'Magic Link', html);
  }
}
