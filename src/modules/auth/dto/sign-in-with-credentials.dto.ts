import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInWithCredentialsDTO {
  @ApiProperty({ description: 'E-mail address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password' })
  @IsString()
  password: string;
}

export class SignInWithCredentialsResponseDTO {
  @ApiProperty({ description: 'Access token' })
  @IsString()
  accessToken: string;
}
