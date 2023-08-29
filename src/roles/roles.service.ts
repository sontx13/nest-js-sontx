import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) {}

  async create(createRoleDto: CreateRoleDto,@User() user:IUser) {
    const isExist = await this.roleModel.findOne({name:createRoleDto.name});
    if(isExist){
      throw new BadRequestException(`Name: ${createRoleDto.name} đã tồn tại!`)
    }

    let newRole = await this.roleModel.create({
        ...createRoleDto,
        createdBy:{
          _id:user._id,
          email:user.email
        }
    })
   
    return {
      _id: newRole?._id,
      createdAt: newRole?.createdAt
    };
  }

  async findAll(currentpage: number,limit: number,qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentpage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.roleModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    // @ts-ignore: Unreachable code error
    .sort(sort)
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
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found role with id: ${id} !`)
    }

    return this.roleModel.findOne({
      _id:id
    }).populate({path:"permissions",select:{_id:1,apiPath:1,name:1,method:1,module:1}})
    //path = join ,_id:1 là chọn lấy ra hoặc -1 là ẩn đi
  }

  async update(id: string, updateRoleDto: UpdateRoleDto,@User() user:IUser) {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new BadRequestException(`Not found role with id: ${id} !`)
    }

    // const isExist = await this.roleModel.findOne({name:updateRoleDto.name});
    // if(isExist){
    //   throw new BadRequestException(`Name: ${updateRoleDto.name} đã tồn tại!`)
    // }
    
    let newRole = await this.roleModel.updateOne(
        {_id:id},
        {
          ...updateRoleDto,
          updatedBy:{
            _id:user._id,
            email:user.email
          }
        }
    )
    return newRole;
  }

  async remove(id: string,@User() user:IUser) {
    if(mongoose.Types.ObjectId.isValid(id)){
      const foundUser = await this.roleModel.findById(id);
      if(foundUser.name === ADMIN_ROLE){
        throw new BadRequestException(`Không thể xoá quyền  ${ADMIN_ROLE}`)
      }

      await this.roleModel.updateOne(
          {_id:id},
          {
            deletedBy:{
              _id:user._id,
              email:user.email
            }
          }
      )

      return this.roleModel.softDelete({
        _id:id
      });
    }else{
      throw new BadRequestException(`Not found role with id: ${id} !`)
    }
  }
}
