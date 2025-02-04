import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VerificationToken } from 'src/entities';
import { Repository } from 'typeorm';
import { LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthSchedule {
  constructor(
    @InjectRepository(VerificationToken)
    private readonly verificationTokenRepository: Repository<VerificationToken>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredSessions() {
    const sessions = await this.verificationTokenRepository.find({
      where: {
        expiresAt: LessThan(new Date()),
      },
    });

    for (const session of sessions) {
      await this.verificationTokenRepository.delete(session.id);
    }
  }
}
