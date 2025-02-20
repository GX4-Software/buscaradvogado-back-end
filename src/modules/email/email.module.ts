import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailJob } from './email.job';
import { BullModule } from '@nestjs/bullmq';
import { EnvService } from 'src/commons/env/env.service';
import { EnvModule } from 'src/commons/env/env.module';

@Module({
  providers: [EmailService, EmailJob],
  exports: [EmailService],

  imports: [
    EnvModule,
    BullModule.registerQueueAsync({
      name: 'email',
    }),
    MailerModule.forRootAsync({
      inject: [EnvService],
      imports: [EnvModule],
      useFactory(env: EnvService) {
        const Host = env.get('EMAIL_HOST');
        const User = env.get('EMAIL_USER');
        const Pass = env.get('EMAIL_PASS');

        return {
          transport: {
            host: Host,
            port: parseInt(env.get('EMAIL_PORT')),
            auth: {
              user: User,
              pass: Pass,
            },
          },
        };
      },
    }),
  ],
})
export class EmailModule {}
