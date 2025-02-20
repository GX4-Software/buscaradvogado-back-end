import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequestDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'First name' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Last name' })
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Phone' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Avatar' })
  avatar: string;

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ description: 'CPF' })
  // cpf: string;

  // @IsString()
  // @IsNotEmpty()
  // @ApiProperty({ description: 'RG' })
  // rg: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Birth date' })
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Address' })
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'City' })
  city: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'State' })
  state: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Zip code' })
  zipCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Proof of address' })
  proofOfAddress: string;
}

export class UserResponseDTO extends CreateUserRequestDTO {
  @ApiProperty({ description: 'ID' })
  id: string;
}
