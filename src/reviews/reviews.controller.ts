import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { CurrentUser } from 'src/utility/decorators/current-user.decorators';
import { UserEntity } from 'src/users/entities/user.entity';
import { ReviewEntity } from './entities/review.entity';
import { AuthorizeRolesGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/userrole.enum';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
@UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto,@CurrentUser() CurrentUser:UserEntity):Promise<ReviewEntity>{
   
    return   await this.reviewsService.create(createReviewDto,CurrentUser);
  }

  @Get("/all")
  findAll() {
    return this.reviewsService.findAll();
  }
  
  @Get()
 async findAllByProduct(@Body("productId") productId:number){
    return  await this.reviewsService.findAllByProduct(+productId)

  }


  @Get(':id')
  findOne(@Param('id') id: string):Promise<ReviewEntity> {
    return this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }
@UseGuards(AuthenticationGuard,AuthorizeRolesGuard([Roles.ADMIN]))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
