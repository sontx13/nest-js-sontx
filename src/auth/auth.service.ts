import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    //username và password là 2 tham so passportjs nem ve
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid=await this.usersService.isValidPassword(pass,user.password);
            if (isValid) {
                return user;
            }
        }
        
        return null;
      }
}
