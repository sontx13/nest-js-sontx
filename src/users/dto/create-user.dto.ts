import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
// class == obj

class Company{
    @IsNotEmpty({message: 'Id không được để trống'})
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;
}

export class    CreateUserDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsEmail({},{message: 'Email không đúng định dạng'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsNotEmpty({message: 'Password không được để trống'})
    password: string;

    @IsNotEmpty({message: 'Age không được để trống'})
    age: number;

    @IsNotEmpty({message: 'Gender không được để trống'})
    gender: number;

    @IsNotEmpty({message: 'Address không được để trống'})
    address: number;

    @IsNotEmpty({message: 'Role không được để trống'})
    role: string;
  
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(()=>Company)
    company: Company;
}

export class    RegisterUserDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsEmail({},{message: 'Email không đúng định dạng'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsNotEmpty({message: 'Password không được để trống'})
    password: string;

    @IsNotEmpty({message: 'Age không được để trống'})
    age: number;

    @IsNotEmpty({message: 'Gender không được để trống'})
    gender: number;

    @IsNotEmpty({message: 'Address không được để trống'})
    address: number;
}