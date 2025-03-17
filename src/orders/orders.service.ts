import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrdersProductsEntity } from './entities/orders-products';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductsService } from 'src/products/products.service';
import { ProductEntity } from 'src/products/entities/product.entity';
import { UpdateOrderStatusDto } from './dto/update_order-status-dto';
import { OrderStatus } from './enums/order-status';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)private readonly orderRepository:Repository<OrderEntity>,
    @InjectRepository(OrdersProductsEntity)private readonly opRepository:Repository<OrdersProductsEntity>,
    private readonly productService:ProductsService
  ){}
  
    async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
      // Create and assign shipping address
      const shippingEntity = new ShippingEntity();
      Object.assign(shippingEntity, createOrderDto.shippingAddress);
  
      // Create and assign order details
      const orderEntity = new OrderEntity();
      orderEntity.shippingAddress = shippingEntity;
      orderEntity.user = currentUser;
  
      // Save the order entity
      const orderTbl = await this.orderRepository.save(orderEntity);

      let opEntity:{
        order:OrderEntity;
        product:ProductEntity;
        product_quantity:number;
        product_unit_price:number
      }[]=[]

      for(let i=0;i<createOrderDto.orderedProducts.length;i++){
        const order= orderTbl;
      const product= await this.productService.findOne(createOrderDto.orderedProducts[i].id)
      const product_quantity=createOrderDto.orderedProducts[i].product_quantity
      const product_unit_price=createOrderDto.orderedProducts[i].product_unit_price


      opEntity.push({
        order,
        product,
        product_quantity,
        product_unit_price

      })
      }
      
      await this.opRepository.createQueryBuilder()
          .insert()
          .into(OrdersProductsEntity)
          .values(opEntity)
          .execute();
  
      // Return the created order
      return this.findOne(orderTbl.id);
    }
//   }async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {
//     // Create and assign shipping address
//     const shippingEntity = new ShippingEntity();
//     Object.assign(shippingEntity, createOrderDto.shippingAddress);

//     // Create and assign order details
//     const orderEntity = new OrderEntity();
//     orderEntity.shippingAddress = shippingEntity;
//     orderEntity.user = currentUser;

//     // Save the order entity
//     const savedOrder = await this.orderRepository.save(orderEntity);

//     // Prepare order products entities
//     const orderProductsEntities = await Promise.all(
//         createOrderDto.orderedProducts.map(async (productDto) => {
//             const product = await this.productService.findOne(productDto.id);
//             return {
//                 order: savedOrder,
//                 product,
//                 product_quantity: productDto.product_quantity,
//                 product_unit_price: productDto.product_unit_price,
//             };
//         })
//     );

//     // Insert order products entities
//     await this.opRepository.createQueryBuilder()
//         .insert()
//         .into(OrdersProductsEntity)
//         .values(orderProductsEntities)
//         .execute();

//     // Return the created order
//     return this.findOne(savedOrder.id);
// 

  async findAll() {
    return  await this.orderRepository.find({
      relations:{
        shippingAddress:true,
        user:true,
        products:{product:true},
      }

    })
  }

  async findOne(id: number) {
    return await this.orderRepository.findOne({
      where:{id},relations:{
        shippingAddress:true,
        user:true,
        products:{product:true},
      }

    })
  }

  async update(id: number, updateOrderStatusDto: UpdateOrderStatusDto,currentUser:UserEntity) {
    let order= await this.findOne(id)
    if(!order)throw new NotFoundException('order not found')
      
      if((order.status===OrderStatus.DELIVERD) ||(order.status===OrderStatus.CANCELLED)){
        throw new BadRequestException(`order already ${order.status}`)}
      
        if((order.status===OrderStatus.PROCESSING && updateOrderStatusDto.status!=OrderStatus.SHIPPED)){
        throw new BadRequestException(`Delivey before shipped `)
      }
      
      if((updateOrderStatusDto.status===OrderStatus.SHIPPED)&&(order.status===OrderStatus.SHIPPED)){
        return order;
      }
      if (updateOrderStatusDto.status === OrderStatus.SHIPPED) {
        order.shippedAt = new Date();
    
      }
      if(updateOrderStatusDto.status===OrderStatus.DELIVERD){

        order.deliveredAt=new Date();
      }
      order.status=updateOrderStatusDto.status,
      order.updatedBy=currentUser
      order= await this.orderRepository.save(order)
      if(updateOrderStatusDto.status===OrderStatus.DELIVERD){
        await this.stockUpdate(order,OrderStatus.DELIVERD)
      }
       return order
  }
  async cancelled(id:number,currentuser:UserEntity){
    let order= await this.findOne(id)
    if(!order)throw new NotFoundException('order not found')
      
      if(order.status===OrderStatus.CANCELLED)
      
        return order
      
        order.status=OrderStatus.CANCELLED
     
        order.updatedBy= currentuser
      
        order= await this.orderRepository.save(order)
      // then you update stock
      await this.stockUpdate(order,OrderStatus.CANCELLED)
      return order

  }


  remove(id: number) {
    return `This action removes a #${id} order`;
  }
  async stockUpdate(order:OrderEntity,status:string){
    for (const op of order.products){
      await this.productService.UpdateStock(op.product.id,op.product_quantity,status)
      
    }
  }
}
