import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Sessions } from 'src/entities';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from 'src/commons/env/env.service';
import { EnvModule } from 'src/commons/env/env.module';
import { SessionSchedule } from './session.schedule';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [SessionService, SessionSchedule],
  exports: [SessionService],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([User, Sessions]),
    JwtModule.registerAsync({
      inject: [EnvService],
      imports: [EnvModule],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY');
        const publicKey = env.get('JWT_PUBLIC_KEY');

        return {
          privateKey,
          publicKey,
          signOptions: {
            algorithm: 'RS256',
          },
        };
      },
    }),
  ],
})
export class SessionModule {}
