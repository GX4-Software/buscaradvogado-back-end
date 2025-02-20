import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EnvService } from 'src/commons/env/env.service';
import { JwtModule } from '@nestjs/jwt';
import { EnvModule } from 'src/commons/env/env.module';
import { UserModule } from '../user/user.module';
import { User, VerificationToken } from 'src/entities';
import { SessionModule } from '../session/session.module';
import { Sessions } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from 'src/commons/crypto/crypto.module';
import { AuthSchedule } from './auth.schedule';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthSchedule, EnvService],
  imports: [
    UserModule,
    SessionModule,
    CryptoModule,
    TypeOrmModule.forFeature([User, Sessions, VerificationToken]),
    ScheduleModule.forRoot(),
    EmailModule,
    EnvModule,
  ],
})
export class AuthModule {}
