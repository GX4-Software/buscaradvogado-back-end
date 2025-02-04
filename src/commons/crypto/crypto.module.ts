import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { EnvModule } from '../env/env.module';

@Module({
  providers: [CryptoService],
  exports: [CryptoService],
  imports: [EnvModule],
})
export class CryptoModule {}
