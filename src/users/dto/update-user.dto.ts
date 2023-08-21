import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password','email'] as const) {
    @IsNotEmpty({message: 'Id không được để trống'})
    _id:string
}
