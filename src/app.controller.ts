import { Controller, Get,Post,Render, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private configService: ConfigService
    ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req){
    return req.user;
  }


  @Get()
  @Render("home")
  getHello() {
    //return 'this.appService.getHello()';
  }
  
}
