import { Type,Transform } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
// class == obj

class Company{
    @IsNotEmpty({message: 'Id Company không được để trống'})
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({message: 'Name Company không được để trống'})
    name: string;

    @IsNotEmpty({message: 'Logo Company không được để trống'})
    logo: string;
}

export class    CreateJobDto {
    @IsNotEmpty({message: 'Name không được để trống'})
    name: string;

    @IsNotEmpty({message: 'Skills không được để trống'})
    @IsArray({message: 'Skills có định dạng là Array'})
    @IsString({each:true,message: 'Mỗi Skill trong Array có định dạng là string'})
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(()=>Company)
    company: Company;

    @IsNotEmpty({message: 'Location không được để trống'})
    location: string;

    @IsNotEmpty({message: 'Salary không được để trống'})
    @IsNumber({},{message: 'Salary không là kiểu số'})
    salary: number;

    @IsNotEmpty({message: 'Quantity không được để trống'})
    @IsNumber({},{message: 'Quantity không là kiểu số'})
    quantity: number;

    @IsNotEmpty({message: 'Level không được để trống'})
    level: string;

    @IsNotEmpty({message: 'Description không được để trống'})
    description: string;
  
    @IsNotEmpty({message: 'StartDate không được để trống'})
    @Transform( ({ value }) => value && new Date(value))
    @IsDate({message: 'StartDate có định dạng là Date'})
    startDate: Date;

    @IsNotEmpty({message: 'EndDate không được để trống'})
    @Transform( ({ value }) => value && new Date(value))
    @IsDate({message: 'EndDate có định dạng là Date'})
    endDate: Date;

    @IsNotEmpty({message: 'IsActive không được để trống'})
    isActive: boolean;
   
}