import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) {}

  async create(createPermissionDto: CreatePermissionDto,@User() user:IUser) {
    const isExist = await this.permissionModel.findOne({apiPath:createPermissionDto.apiPath,method:createPermissionDto.method});
    if(isExist){
      throw new BadRequestException(`apiPath: ${createPermissionDto.apiPath} và method: ${createPermissionDto.method} đã tồn tại!`)
    }

    let newPermission = await this.permissionModel.create({
        ...createPermissionDto,
        createdBy:{
          _id:user._id,
          email:user.email
        }
    })
   
    return {
      _id: newPermission?._id,
      createdAt: newPermission?.createdAt
    };
  }

  async findAll(currentpage: number,limit: number,qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentpage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.permissionModel.find(filter)
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
      throw new BadRequestException(`Not found permission with id: ${id} !`)
    }
    return this.permissionModel.findOne({
      _id:id
    })
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto,@User() user:IUser) {
    let newPermission = await this.permissionModel.updateOne(
        {_id:id},
        {
          ...updatePermissionDto,
          updatedBy:{
            _id:user._id,
            email:user.email
          }
        }
    )
    return newPermission;
  }

  async remove(id: string,@User() user:IUser) {
    if(mongoose.Types.ObjectId.isValid(id)){
      await this.permissionModel.updateOne(
          {_id:id},
          {
            deletedBy:{
              _id:user._id,
              email:user.email
            }
          }
      )

      return this.permissionModel.softDelete({
        _id:id
      });
    }else{
      throw new BadRequestException(`Not found permission with id: ${id} !`)
    }
  }
}
