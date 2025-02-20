import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from 'src/commons/crypto/crypto.module';
import { SessionModule } from '../session/session.module';
import { S3Module } from '../s3/s3.module';
import { EnvModule } from 'src/commons/env/env.module';
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User]), CryptoModule, SessionModule, S3Module, EnvModule],
})
export class UserModule {}
