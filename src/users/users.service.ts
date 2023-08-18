import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync,hashSync,compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class UsersService {
  //constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) {}
  getHashPassword = (password: string)=>{
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);

    return hash;
  }
  async create(createUserDto: CreateUserDto) {
    const hashPassword = this.getHashPassword(createUserDto.password);
    let user = await this.userModel.create({
        email:createUserDto.email,
        password: hashPassword,
        name: createUserDto.name
    })
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if(mongoose.Types.ObjectId.isValid(id)){
      let user = this.userModel.findOne({
        _id:id
      })
      return user;
    }else{
      return `Not found user`;
    }
  }

  findOneByUsername(username: string) {
      let user = this.userModel.findOne({
        email:username
      })
      return user;
  }

  isValidPassword(password: string,hash:string){
     return compareSync(password,hash);
  }

  async update(updateUserDto: UpdateUserDto) {
      let user = await this.userModel.updateOne(
        {_id:updateUserDto._id},{...updateUserDto}
    )
    return user;
  }

  remove(id: string) {
    if(mongoose.Types.ObjectId.isValid(id)){
      let user = this.userModel.softDelete({
        _id:id
      })
      return user;
    }else{
      return `Not found user`;
    }
  }
}
