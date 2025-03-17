import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { OrderStatus } from "../enums/order-status";

export class UpdateOrderStatusDto{
    @IsNotEmpty()
    @IsString()
    @IsIn([OrderStatus.SHIPPED,OrderStatus.DELIVERD])
    status:OrderStatus
}