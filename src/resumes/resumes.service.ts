import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto, CreateUserCVDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModel: SoftDeleteModel<ResumeDocument>) {}

  async create(createUserCVDto: CreateUserCVDto,user:IUser) {
    
    let resume = await this.resumeModel.create({
        email:user.email,
        userId: user._id,
        url: createUserCVDto.url,
        status: "PENDING",
        companyId: createUserCVDto.companyId,
        jobId: createUserCVDto.jobId,
        history: [
          {
            status: "PENDING",
            updatedAt: new Date,
            updatedBy: {
              _id: user._id,
              email: user.email
            }
          }
        ],
        createdBy:{
          _id:user._id,
          email:user.email
        }
    })
   
    return {
      _id: resume?._id,
      createdAt: resume?.createdAt
    };
  }

  async findAll(currentpage: number,limit: number,qs: string) {
    const { filter, sort, population,projection } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentpage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.resumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.resumeModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    // @ts-ignore: Unreachable code error
    .sort(sort)
    .populate(population)
    .select(projection as any)
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
      let user = this.resumeModel.findOne({
        _id:id
      });
      return user;
    }else{
      throw new BadRequestException(`id: ${id} không tồn tại!`)
    }
  }

  async findAllbyUser(user:IUser) {
      //return user;
      return await this.resumeModel.find({
        userId:user._id
      })
      .sort("-createdAt")
      .populate([
      {
      path: "companyId",
      select: { name: 1 }
      },
      {
      path: "jobId",
      select: { name: 1 }
      }
      ])

  }

  async update(id: string, status: string,user:IUser) {
    if(mongoose.Types.ObjectId.isValid(id)){
        let resume = await this.resumeModel.updateOne(
            {_id:id},
            {
              status,
              $push: {history: 
                {
                  status,
                  updatedAt: new Date,
                  updatedBy: {
                    _id: user._id,
                    email: user.email
                  }
                }
              },
              updatedBy:{
                _id:user._id,
                email:user.email
              }
            }
        )
        return resume;
    }else{
      throw new BadRequestException(`id: ${id} không tồn tại!`)
    }       
  }

  async remove(id: string,user:IUser) {
    if(mongoose.Types.ObjectId.isValid(id)){
      await this.resumeModel.updateOne(
          {_id:id},
          {
            deletedBy:{
              _id:user._id,
              email:user.email
            }
          }
      )

      return this.resumeModel.softDelete({
        _id:id
      });
    }else{
      throw new BadRequestException(`id: ${id} không tồn tại!`)
    }
  }
}
