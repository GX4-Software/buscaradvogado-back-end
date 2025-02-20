import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { EnvService } from 'src/commons/env/env.service';

@Injectable()
@Processor('email')
export class EmailJob extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    private readonly env: EnvService,
  ) {
    super();
  }

  async process(job: Job) {
    await this.sendEmail(job.data.to, job.data.subject, job.data.template);
  }

  private async sendEmail(to: string, subject: string, template: string) {
    await this.mailerService.sendMail({
      from: this.env.get('EMAIL_FROM'),
      to,
      subject,
      html: template,
    });
  }

}
