import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvModule } from './commons/env/env.module';
import { envSchema } from './commons/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env)
    }),
    EnvModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
