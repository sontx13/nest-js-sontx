import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {

  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) {}

  async create(createCompanyDto: CreateCompanyDto,user:IUser) {
    return await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
      _id: user._id,
      email: user.email
      }
    })
  }

  async findAll(currentpage: number,limit: number,qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    //let { sort } = aqp(rq);
    let offset = (+currentpage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.companyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    //if (isEmpty(sort)) {
    // @ts-ignore: Unreachable code error
    //sort = "-updatedAt"
    //}
    const result = await this.companyModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    // @ts-ignore: Unreachable code error
    .sort(sort)
    .populate(population)
    .exec();

    //let { sort }= <{sort: any}>aqp(rq);
    //let { sort }: {sort: any}= aqp(rq);
    //.sort(sort as any)
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
      let company = this.companyModel.findOne({
        _id:id
      });
      return company;
    }else{
      throw new BadRequestException(`Not found company with ${id}`);
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto,user:IUser) {
    return await this.companyModel.updateOne(
      {_id:id},
      {...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      },
    )
  }

  async remove(id: string,user:IUser) {
    if(mongoose.Types.ObjectId.isValid(id)){
      await this.companyModel.updateOne(
        {_id:id},
        {deletedBy: {
            _id: user._id,
            email: user.email
          }
        }
      )

      return this.companyModel.softDelete({
        _id:id
      })
    }else{
      return `Not found company`;
    }
  }
}
