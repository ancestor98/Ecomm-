import { Type } from "class-transformer";
import { CreateShippingDto } from "./create-shipping";
import { ValidateNested } from "class-validator";
import { OrderProductsDto } from "./orderd-products.dto";

export class CreateOrderDto {

    @Type(()=>CreateShippingDto)
    @ValidateNested()
    shippingAddress:CreateShippingDto;

    @Type(()=>OrderProductsDto)
    @ValidateNested()
    orderedProducts:OrderProductsDto[]
}
