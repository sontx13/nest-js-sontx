import { IsEmail, IsNotEmpty } from 'class-validator';
// class == obj
export class CreateUserDto {
    @IsEmail({},{message: 'Email không đúng định dạng'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsNotEmpty({message: 'Password không được để trống'})
    password: string;

    name: string;
    age: number;
}