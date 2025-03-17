import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorators';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(ReviewEntity) private readonly reviewRepository:Repository<ReviewEntity>,
private readonly productService:ProductsService){}
async create(createReviewDto: CreateReviewDto, currentUser: UserEntity): Promise<ReviewEntity> {
  // Step 1: Find the product being reviewed
  const product = await this.productService.findOne(createReviewDto.productId);

  // Step 2: Check if the user already reviewed this product
  let review = await this.findOneByUserAndProduct(currentUser.id, createReviewDto.productId);

  // Step 3: If no review exists, create a new one
  if (!review) {
    review = this.reviewRepository.create(createReviewDto); // Create new review
    review.user = currentUser; // Link to the user
    review.product = product; // Link to the product
  } else {
    // Step 4: If a review exists, update it
    review.comments = createReviewDto.comment; // Update comments
    review.ratings = createReviewDto.ratings; // Update ratings
  }

  // Step 5: Save the review to the database
  return await this.reviewRepository.save(review);
}

  findAll() {
    return `This action returns all reviews`;
  }
  async findAllByProduct(id:number):Promise<ReviewEntity[]>{
    const product= await this.productService.findOne(id);
    return await this.reviewRepository.find({

      where:{ product:{id}},
      relations:{
        user:true,
        product:{
          category:true
        }
      }

    })


  }

  async findOne(id: number):Promise<ReviewEntity> {
    const review= await this.reviewRepository.findOne({
      where:{id},
      relations:{
        user:true,
        product:{
          category:true
        }
        
      }
    });if(!review) throw new NotFoundException("nigga this review was not foundbro")
     return review
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: number) {
    const review= await this.findOne(id)

    return await this.reviewRepository.remove(review)
  }
  async findOneByUserAndProduct(userid:number,productId:number){
    return await this.reviewRepository.findOne({
      where:{
        user:{id:userid},
        product:{id:productId

        }
      },relations:{
        user:true,
        product:{
          category:true
        }
      }
    })
  }
}
