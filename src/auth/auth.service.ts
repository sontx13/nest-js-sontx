import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService,
        private jwtService: JwtService
        ) {}

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

    async login(user: IUser) {
        const { _id, name, email, role } = user;
        const payload = {
        sub: "token login",
        iss: "from server",
        _id,
        name,
        email,
        role
    };
    return {
        access_token: this.jwtService.sign(payload),
        _id,
        name,
        email,
        role
        };
    }
        
}
