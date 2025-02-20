import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInWithCredentialsDTO } from './dto/sign-in-with-credentials.dto';
import { SessionService } from '../session/session.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CryptoService } from 'src/commons/crypto/crypto.service';
import { User, VerificationToken } from 'src/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../email/email.service';
import { EnvService } from 'src/commons/env/env.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    @InjectRepository(VerificationToken)
    private readonly verificationTokenRepository: Repository<VerificationToken>,
    private readonly emailService: EmailService,
    private readonly envService: EnvService,
  ) {}

  public async signInWithCredentials(body: SignInWithCredentialsDTO) {
    const user = await this.userService.getUserByEmail(body.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.cryptoService.comparePassword(
      body.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    return this.TWO_FACTOR_AUTHENTICATION(user);
  }

  private async TWO_FACTOR_AUTHENTICATION(user: User) {
    const generatedToken = this.verificationTokenRepository.create({
      identifier: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 5),
    });

    const token = await this.verificationTokenRepository.save(generatedToken);

    await this.emailService.sendMagicLinkEmail(
      user.email,
      user.firstName,
      this.envService.get('ORIGIN_URL') +
        '/auth/verify-two-factor-authentication?token=' +
        token.id,
    );

    return;
  }

  public async verifyTwoFactorAuthentication(token: string) {
    const verificationToken = await this.verificationTokenRepository.findOne({
      where: { id: token },
    });

    if (!verificationToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userService.getUserById(
      verificationToken.identifier,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    const session = await this.sessionService.createSession(
      verificationToken.identifier,
    );

    await this.verificationTokenRepository.delete(verificationToken.id);

    const generatedToken = this.jwtService.sign(
      {
        sessionId: session.sessionId,
        userId: verificationToken.identifier,
        email: user.email,
        role: user.role,
      },
      { expiresIn: '1d' },
    );

    return {
      accessToken: generatedToken,
    };
  }
}
