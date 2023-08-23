import { Type } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
// class == obj

export class    CreateResumeDto {
    @IsEmail({},{message: 'Email không đúng định dạng'})
    @IsNotEmpty({message: 'Email không được để trống'})
    email: string;

    @IsNotEmpty({message: 'userId không được để trống'})
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'Url không được để trống'})
    url: string;

    @IsNotEmpty({message: 'Status không được để trống'})
    status: string;

    @IsNotEmpty({message: 'CompanyId không được để trống'})
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'JobId không được để trống'})
    jobId: mongoose.Schema.Types.ObjectId;
  
}

export class    CreateUserCVDto {
    @IsNotEmpty({message: 'Url không được để trống'})
    url: string;

    @IsNotEmpty({message: 'CompanyId không được để trống'})
    @IsMongoId({message: 'CompanyId không là mongo id'})
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'JobId không được để trống'})
    @IsMongoId({message: 'JobId không là a mongo id'})
    jobId: mongoose.Schema.Types.ObjectId;
}