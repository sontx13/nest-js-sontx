import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { genSaltSync,hashSync,compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import { User } from 'src/decorator/customize';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  //constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  constructor(@InjectModel(UserM.name) private userModel: SoftDeleteModel<UserDocument>) {}
  getHashPassword = (password: string)=>{
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);

    return hash;
  }

  async create(createUserDto: CreateUserDto,@User() user:IUser) {
    const isExist = await this.userModel.findOne({email:createUserDto.email});
    if(isExist){
      throw new BadRequestException(`Email: ${createUserDto.email} đã tồn tại!`)
    }

    const hashPassword = this.getHashPassword(createUserDto.password);
    let newUser = await this.userModel.create({
        name: createUserDto.name,
        email:createUserDto.email,
        password: hashPassword,
        age: createUserDto.age,
        gender: createUserDto.gender,
        address: createUserDto.address,
        role: createUserDto.role,
        company: createUserDto.company,
        createdBy:{
          _id:user._id,
          email:user.email
        }
    })
   
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const isExist = await this.userModel.findOne({email:registerUserDto.email});
    if(isExist){
      throw new BadRequestException(`Email: ${registerUserDto.email} đã tồn tại!`)
    }

    const hashPassword = this.getHashPassword(registerUserDto.password);

    let user = await this.userModel.create({
        name: registerUserDto.name,
        email: registerUserDto.email,
        password: hashPassword,
        age: registerUserDto.age,
        gender: registerUserDto.gender,
        address: registerUserDto.address,
        role: "USER",
    })
    return user;
  }

  async findAll(currentpage: number,limit: number,qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentpage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    // @ts-ignore: Unreachable code error
    .sort(sort)
    .select("-password")
    .populate(population)
    .exec();

    return {
      meta: {
      current: currentpage, //trang hiện tại
      pageSize: limit, //số lượng bản ghi đã lấy
      pages: totalPages, //tổng số trang với điều kiện query
      total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    if(mongoose.Types.ObjectId.isValid(id)){
      let user = this.userModel.findOne({
        _id:id
      }).select("-password");
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

  async update(updateUserDto: UpdateUserDto,@User() user:IUser) {
    // let isExist = await this.userModel.findOne({email:updateUserDto.email});
   
    // if(isExist){
    //    throw new BadRequestException(`Email: ${updateUserDto.email} đã tồn tại!`)
    // }

    let newUser = await this.userModel.updateOne(
        {_id:updateUserDto._id},
        {
          name: updateUserDto.name,
          age: updateUserDto.age,
          gender: updateUserDto.gender,
          address: updateUserDto.address,
          role:  updateUserDto.role,
          updatedBy:{
            _id:user._id,
            email:user.email
          }
        }
    )
    return newUser;
  }

  async remove(id: string,@User() user:IUser) {
    if(mongoose.Types.ObjectId.isValid(id)){
      await this.userModel.updateOne(
          {_id:id},
          {
            deletedBy:{
              _id:user._id,
              email:user.email
            }
          }
      )

      return this.userModel.softDelete({
        _id:id
      });
    }else{
      return `Not found user`;
    }
  }

  updateUserToken = async (refreshToken: string, _id:string) => {
    return await this.userModel.updateOne(
      {_id},
      {refreshToken}
    )
  } 
}
