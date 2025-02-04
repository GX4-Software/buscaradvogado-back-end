import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Sessions } from 'src/entities';
import { Repository } from 'typeorm';
import { LessThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SessionSchedule {
  constructor(
    @InjectRepository(Sessions)
    private readonly sessionRepository: Repository<Sessions>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredSessions() {
    const sessions = await this.sessionRepository.find({
      where: {
        session_token_expires: LessThan(new Date()),
      },
    });

    for (const session of sessions) {
      await this.sessionRepository.delete(session.id);
    }
  }
}
