import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

import { IUser } from 'src/users/users.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage("Create a company")
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return this.companiesService.create(createCompanyDto,user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch list company with paginate")
  findAll(@Query("current") currentpage: string,
  @Query("pageSize") limit: string,
  @Query() qs:string
  ) {
    return this.companiesService.findAll(+currentpage,+limit,qs);
  }

  @Public()
  @ResponseMessage("Fetch company by id")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a company")
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    return this.companiesService.update(id, updateCompanyDto,user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a company")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id,user);
  }
}
