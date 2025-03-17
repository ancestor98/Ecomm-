import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class OrderProductsDto{
     @IsNotEmpty()
     id:number

    @IsNumber({maxDecimalPlaces:2},{message:"price should be number& decimal precisssion"})
     @IsPositive({message:"price can not be negative"})
    product_unit_price:number;

    @IsNumber({},{message:"quantity should be number"})
    @IsPositive({message:"quantity can not be negative"})
    product_quantity:number;
}