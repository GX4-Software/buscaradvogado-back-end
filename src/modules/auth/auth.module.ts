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

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthSchedule],
  imports: [
    UserModule,
    SessionModule,
    CryptoModule,
    TypeOrmModule.forFeature([User, Sessions, VerificationToken]),
    ScheduleModule.forRoot(),
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
export class AuthModule {}
