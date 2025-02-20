import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { User, Sessions } from 'src/entities';
import { SessionService } from 'src/modules/session/session.service';
import { CryptoService } from '../crypto/crypto.service';
export interface RequestWithAuth extends Request {
  user: User;
  session?: Sessions;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly cryptoService: CryptoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithAuth = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    let token: string;

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      token = authHeader;
    }

    if (!token) return false;

    const user = await this.sessionService.validateSession(token);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const { password, ...userWithoutPassword } = user.user;
    request.user = userWithoutPassword as User;
    request.session = user.session;

    if(request.user.profileCompleted) {
      request.user.cpf = this.cryptoService.decrypt(request.user.cpf);
      request.user.rg = this.cryptoService.decrypt(request.user.rg);
    }
    request.user.phone = this.cryptoService.decrypt(request.user.phone);

    return true;
  }
}
