import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from 'src/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from 'src/commons/crypto/crypto.module';
import { SessionModule } from '../session/session.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User]), CryptoModule, SessionModule],
})
export class UserModule {}
