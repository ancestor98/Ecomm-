import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { Roles } from 'src/utility/common/userrole.enum';
import { AuthorizeRolesGuard } from 'src/utility/guards/authorization.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorators';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {

  constructor(private readonly productsService: ProductsService) {}


 @UseGuards(AuthenticationGuard,AuthorizeRolesGuard([Roles.ADMIN]))
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,@CurrentUser() currentUser:UserEntity):Promise<ProductEntity> {
    return this.productsService.create(createProductDto,currentUser);
  }

  @Get()
  async findAll():Promise <ProductEntity[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
@UseGuards(AuthenticationGuard,AuthorizeRolesGuard([Roles.ADMIN]))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto,@CurrentUser() currentuser:UserEntity):Promise<ProductEntity> {
    return this.productsService.update(+id, updateProductDto ,currentuser);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
