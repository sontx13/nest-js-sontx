import { Body, Controller, Get,Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from '../decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request as RequestEx, Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
    ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ResponseMessage("User Login")
  handleLogin(@Request() req, @Res({ passthrough: true }) response: Response){
    return this.authService.login(req.user,response);
  }

  @Public()
  @ResponseMessage("Register a user")
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto){
    //return req.user;
    return this.authService.register(registerUserDto);
  }

  @Get('account')
  @ResponseMessage("Get user information")
  handleAccount(@User() user: IUser) {
    return {user};
  }

  @Public()
  @Get('refresh')
  @ResponseMessage("Get User by refresh token")
  handleRefreshToken(@Req() request: RequestEx,@Res({ passthrough: true }) response: Response) {
    const refresh_token = request.cookies['refresh_token'];
    return this.authService.processNewToken(refresh_token,response);
  }

  @Post('logout')
  @ResponseMessage("Logout User")
  handleLogout(@User() user: IUser,@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(user,response);
  }
}
