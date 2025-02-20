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
import { S3Service } from '../s3/s3.service';
import { EnvService } from 'src/commons/env/env.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cryptoService: CryptoService,
    private s3Service: S3Service,
    private env: EnvService,
  ) {}

  public async create(createUserDto: CreateUserRequestDTO) {
    const verifyEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email, profileCompleted: false },
    });

    if (verifyEmail) {
      throw new BadRequestException('Email already exists');
    }

    const user = this.userRepository.create(createUserDto);
    user.password = await this.cryptoService.hashPassword(user.password);
    user.phone = this.cryptoService.encrypt(user.phone);

    this.userRepository.save(user);

    return {
      message: 'User created successfully',
    };
  }

  public async completeProfile(userData: User, rg: Express.Multer.File, cpf: Express.Multer.File) {
    if(userData.profileCompleted) {
      throw new BadRequestException('Profile already completed');
    }

    const rgKey = await this.s3Service.uploadFile(this.env.get('S3_PRIMARY_BUCKET'), rg.originalname, rg.buffer, rg.mimetype);
    const cpfKey = await this.s3Service.uploadFile(this.env.get('S3_PRIMARY_BUCKET'), cpf.originalname, cpf.buffer, cpf.mimetype);

    const rgUrl = await this.s3Service.getUrl(this.env.get('S3_PRIMARY_BUCKET'), rgKey);
    const cpfUrl = await this.s3Service.getUrl(this.env.get('S3_PRIMARY_BUCKET'), cpfKey);

    const rgCrypto = this.cryptoService.encrypt(rgUrl);
    const cpfCrypto = this.cryptoService.encrypt(cpfUrl);

    await this.userRepository.update({
      id: userData.id,
    }, {
      rg: rgCrypto,
      cpf: cpfCrypto,
      profileCompleted: true,
    });    

    return {
      message: 'Profile completed successfully', 
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
