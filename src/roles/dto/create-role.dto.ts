import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';


export class    CreateRoleDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsNotEmpty({message: 'Description không được để trống'})
    description: string;

    @IsNotEmpty({message: 'IsActive không được để trống'})
    @IsBoolean({message: 'IsActive có giá trị Boolean'})
    isActive: boolean;

    @IsNotEmpty({message: 'Permissions không được để trống'})
    @IsMongoId({each:true,message: 'có 1 module không là a mongo id'})
    @IsArray({message: 'Permissions k là định dạng Array'})
    permissions: mongoose.Schema.Types.ObjectId[];
 
}