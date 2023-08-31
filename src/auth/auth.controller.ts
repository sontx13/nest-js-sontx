import { Body, Controller, Get,Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from '../decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Request as RequestEx, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private roleService: RolesService
    ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBody({ type: UserLoginDto, })
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
  async handleAccount(@User() user: IUser) {
    const temp = await this.roleService.findOne(user.role._id) as any; //bỏ đi check type
    user.permissions = temp.permissions;
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
