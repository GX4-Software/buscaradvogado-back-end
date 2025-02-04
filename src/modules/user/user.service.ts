import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserRequestDTO } from './dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/commons/crypto/crypto.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cryptoService: CryptoService,
  ) {}

  public async create(createUserDto: CreateUserRequestDTO) {
    const verifyEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (verifyEmail) {
      throw new BadRequestException('Email already exists');
    }

    const user = this.userRepository.create(createUserDto);
    user.password = await this.cryptoService.hashPassword(user.password);
    user.cpf = this.cryptoService.encrypt(user.cpf);
    user.rg = this.cryptoService.encrypt(user.rg);
    user.phone = this.cryptoService.encrypt(user.phone);

    this.userRepository.save(user);

    return {
      message: 'User created successfully',
    };
  }

  public async verifyEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { emailVerified: false, email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.emailVerified = true;
    this.userRepository.save(user);

    return {
      message: 'Email verified successfully',
    };
  }

  public async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.phone = this.cryptoService.decrypt(user.phone);
    user.cpf = this.cryptoService.decrypt(user.cpf);
    user.rg = this.cryptoService.decrypt(user.rg);

    return user;
  }

  public async getUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.phone = this.cryptoService.decrypt(user.phone);
    user.cpf = this.cryptoService.decrypt(user.cpf);
    user.rg = this.cryptoService.decrypt(user.rg);

    return user;
  }

  public async getCurrentUser(user: User) {
    return user;
  }
}
