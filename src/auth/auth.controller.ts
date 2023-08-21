import { Body, Controller, Get,Post,Render, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from '../decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
    ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req){
    return this.authService.login(req.user);
  }

  @Public()
  @ResponseMessage("Register a user")
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto){
    //return req.user;
    return this.authService.register(registerUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
