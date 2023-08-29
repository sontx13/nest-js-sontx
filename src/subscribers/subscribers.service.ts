import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-Subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-Subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';

@Injectable()
export class SubscribersService {
  constructor(@InjectModel(Subscriber.name) private SubscriberModel: SoftDeleteModel<SubscriberDocument>) {}

  async create(createSubscriberDto: CreateSubscriberDto,@User() user:IUser) {
    const isExist = await this.SubscriberModel.findOne({email:createSubscriberDto.email});
    if(isExist){
      throw new BadRequestException(`email: ${createSubscriberDto.email} đã tồn tại!`)
    }

    let newSubscriber = await this.SubscriberModel.create({
        ...createSubscriberDto,
        createdBy:{
          _id:user._id,
          email:user.email
        }
    })
  
    return {
      _id: newSubscriber?._id,
      createdAt: newSubscriber?.createdAt
    };
  }

  async findAll(currentpage: number,limit: number,qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentpage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.SubscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.SubscriberModel.find(filter)
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
    if(mongoose.Types.ObjectId.isValid(id)){
      let Subscriber = this.SubscriberModel.findOne({
        _id:id
      });
      return Subscriber;
    }else{
      return `Not found Subscriber`;
    }
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto,@User() user:IUser) {
    let newSubscriber = await this.SubscriberModel.updateOne(
      {_id:id},
      {
        ...updateSubscriberDto,
        isActive:true,
        updatedBy:{
          _id:user._id,
          email:user.email
        }
    })

    return {
      newSubscriber
    };
  }

  async remove(id: string,@User() user:IUser) {
    if(mongoose.Types.ObjectId.isValid(id)){
      await this.SubscriberModel.updateOne(
          {_id:id},
          {
            deletedBy:{
              _id:user._id,
              email:user.email
            }
          }
      )

      return this.SubscriberModel.softDelete({
        _id:id
      });
    }else{
      return `Not found Subscriber`;
    }
  }
}
