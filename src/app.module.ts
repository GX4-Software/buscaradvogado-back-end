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

    EnvModule,
    AuthModule,
    UserModule,
    CryptoModule,
    HealthcheckModule,
    SessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
