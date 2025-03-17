import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorators';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { Roles } from 'src/utility/common/userrole.enum';
import { AuthorizeRolesGuard } from 'src/utility/guards/authorization.guard';
import { UpdateOrderStatusDto } from './dto/update_order-status-dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
@UseGuards(AuthenticationGuard)
  @Post()
 async  create(@Body() createOrderDto: CreateOrderDto,@CurrentUser() currentuser:UserEntity) {
    return await  this.ordersService.create(createOrderDto,currentuser);
  }

  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Get(':id')
async   findOne(@Param('id') id: string) {
    return  await this.ordersService.findOne(+id);
  }
  @UseGuards(AuthenticationGuard,AuthorizeRolesGuard([Roles.ADMIN]))
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto,@CurrentUser() currentUser:UserEntity) {
    return await this.ordersService.update(+id, updateOrderStatusDto,currentUser);
  }
  @Put("cancelled/:id")
  async cancelled(@Param("id")id:string,@CurrentUser() currentUser:UserEntity){
    return this.ordersService.cancelled(+id,currentUser)
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
