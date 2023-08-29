import { Type,Transform } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

export class    CreateSubscriberDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsNotEmpty({message: 'Skills không được để trống'})
    @IsArray({message: 'Skills có định dạng là Array'})
    @IsString({each:true,message: 'Mỗi Skill trong Array có định dạng là string'})
    skills: string[];

}