import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sessions, USER_ROLE } from 'src/entities';
import { User } from 'src/entities';
import { JwtService } from '@nestjs/jwt';
import { MoreThan } from 'typeorm';
import { Role as RoleEnum } from '.ignore/constants/role.enum';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Sessions)
    private sessionRepository: Repository<Sessions>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  public async createSession(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const session = this.sessionRepository.create({
      user: user,
    });

    this.sessionRepository.save(session);

    return {
      message: 'Session created successfully',
      sessionId: session.id,
    };
  }

  public async getSession(sessionId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['user'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return {
      message: 'Session found successfully',
      session,
    };
  }

  public async validateSession(token: string) {
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    const decoded = this.jwtService.decode<{
      sessionId: string;
      userId: string;
      email: string;
      role: RoleEnum;
    }>(token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    const session = await this.sessionRepository.findOne({
      where: {
        id: decoded.sessionId,
        session_token_expires: MoreThan(new Date()),
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: decoded.userId, email: decoded.email, emailVerified: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.role) {
      throw new UnauthorizedException('User role does not match');
    }

    const userWithoutPassword = {
      ...user,
      password: undefined,
    };

    return {
      session,
      user: userWithoutPassword,
    };
  }
}
