import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserPayload } from 'src/auth/dto/user-payload.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req: Request & { user: UserPayload }) {
    return req.user;
  }

  @Post()
  async create(@Body() body: { email: string; password: string }) {
    return this.userService.create(body);
  }
}
