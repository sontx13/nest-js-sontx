import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage("Create a new subscriber")
  create(@Body() createSubscriberDto: CreateSubscriberDto,@User() user:IUser) {
    return this.subscribersService.create(createSubscriberDto,user);
  }

  @Get()
  @ResponseMessage("Fetch subscribers with paginate")
  findAll(
    @Query("current") currentpage: string,
    @Query("pageSize") limit: string,
    @Query() qs:string
  ) {
    return this.subscribersService.findAll(+currentpage,+limit,qs);
  }

  @Get(':id')
  @ResponseMessage("Fetch subscriber by id")
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch()
  @SkipCheckPermission()
  @ResponseMessage("Update a subscriber")
  update(@Body() updateSubscriberDto: UpdateSubscriberDto,@User() user:IUser) {
    return this.subscribersService.update(updateSubscriberDto,user);
  }

  @Post('skills')
  @SkipCheckPermission()
  @ResponseMessage("Get subscriber's skills")
  getUserSkills(@User() user:IUser) {
    return this.subscribersService.getSkills(user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a subscriber")
  remove(@Param('id') id: string,@User() user:IUser) {
    return this.subscribersService.remove(id,user);
  }
}
