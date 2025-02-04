import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class VerifyTwoFactorAuthenticationDTO {
  @ApiProperty({
    description: 'Token',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class VerifyTwoFactorAuthenticationResponseDTO {
  @ApiProperty({
    description: 'Access token',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
