import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthUser } from './auth/auth-user.decorator';
import { FirebaseGuard } from './auth/firebase.guard';
import { User } from './users/entities/user.entity';

@Controller()
export class AppController {
  @Get('/')
  unauthenticated(): string {
    return;
  }

  @Get('/authenticated')
  @UseGuards(FirebaseGuard)
  authenticated(@AuthUser() user: User): User {
    return user;
  }
}
