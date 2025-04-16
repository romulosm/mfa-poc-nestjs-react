import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserPayload } from './dto/user-payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('mfa/setup')
  async setupMfa(@CurrentUser() user: UserPayload) {
    return this.authService.generateMfaSetup(user.userId, user.email);
  }

  @Post('mfa/verify')
  @UseGuards(AuthGuard('jwt'))
  async verifyMfa(
    @CurrentUser() user: UserPayload,
    @Body() body: { code: string },
  ) {
    return this.authService.verifyMfa(user.userId, body.code);
  }
}
