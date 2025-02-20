import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvModule } from './commons/env/env.module';
import { Env, envSchema } from './commons/env';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { CryptoModule } from './commons/crypto/crypto.module';
import { HealthcheckModule } from './modules/healthcheck/healthcheck.module';
import { SessionModule } from './modules/session/session.module';
import { BullModule } from '@nestjs/bullmq';
import { EnvService } from './commons/env/env.service';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './modules/email/email.module';
import { S3Module } from './modules/s3/s3.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: new ConfigService<Env, true>().get('DATABASE_URL'),
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),

    BullModule.forRootAsync({
      inject: [EnvService],
      imports: [EnvModule],
      useFactory(env: EnvService) {
        return {
          connection: {
            host: env.get('REDIS_HOST'),
            port: parseInt(env.get('REDIS_PORT')),
          },
        };
      },
    }),

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

    EnvModule,
    AuthModule,
    UserModule,
    CryptoModule,
    HealthcheckModule,
    SessionModule,
    EmailModule,
    S3Module
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
