import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDTO, UserResponseDTO } from './dto/create-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CryptoService } from 'src/commons/crypto/crypto.service';
import { CurrentUser } from 'src/commons/decorators/current-user.decorator';
import { User } from 'src/entities';
import { AuthGuard } from 'src/commons/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptoService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register user',
    description: 'Register a new user',
  })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: CreateUserRequestDTO })
  create(@Body() createUserDto: CreateUserRequestDTO) {
    return this.userService.create(createUserDto);
  }

  @Get('verify-email/:email')
  @ApiOperation({ summary: 'Verify email' })
  @ApiParam({ name: 'email', type: String })
  @ApiResponse({ status: 200, description: 'Email verified' })
  @ApiResponse({ status: 404, description: 'User not found' })
  verifyEmail(@Param('email') email: string) {
    return this.userService.verifyEmail(email);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user',
    type: UserResponseDTO,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  getCurrentUser(@CurrentUser() user: User) {
    return this.userService.getCurrentUser(user);
  }
}
