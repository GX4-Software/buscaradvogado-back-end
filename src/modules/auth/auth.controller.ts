import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';
import {
  SignInWithCredentialsDTO,
  SignInWithCredentialsResponseDTO,
} from './dto/sign-in-with-credentials.dto';
import { VerifyTwoFactorAuthenticationDTO } from './dto/verify-two-factor-authentication.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Realize user authentication',
    description: 'Authenticate user and return access token',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Email not verified',
  })
  signInWithCredentials(@Body() body: SignInWithCredentialsDTO) {
    return this.authService.signInWithCredentials(body);
  }

  @Post('verify-two-factor-authentication')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify two factor authentication',
    description: 'Verify two factor authentication and return access token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Two factor authentication verified successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid token',
  })
  verifyTwoFactorAuthentication(
    @Body() body: VerifyTwoFactorAuthenticationDTO,
  ) {
    return this.authService.verifyTwoFactorAuthentication(body.token);
  }
}
