import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  constructor(private readonly env: EnvService) {}

  private readonly algorithm = 'aes-256-cbc';
  private readonly key = this.env.get('CRYPTO_KEY');

  public async hashPassword(password: string) {
    return await argon2.hash(password, { type: argon2.argon2id });
  }

  public async comparePassword(password: string, hash: string) {
    return await argon2.verify(hash, password);
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');

    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
