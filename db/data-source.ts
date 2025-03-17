import { DataSource, DataSourceOptions } from "typeorm";
import { UserEntity } from "src/users/entities/user.entity";

//entities: [UserEntity],

//import * as dotenv from 'dotenv';
//dotenv.config();

import * as dotenv from 'dotenv';
import { CategoryEntity } from "src/categories/entities/category.entity";
import { ProductEntity } from "src/products/entities/product.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { OrderEntity } from "src/orders/entities/order.entity";
import { OrdersProductsEntity } from "src/orders/entities/orders-products";
import { ShippingEntity } from "src/orders/entities/shipping.entity";
const result = dotenv.config();

if (result.error) {
  console.log('Error loading .env file:', result.error);
} else {
  console.log('DB_TEST:', process.env.DB_TEST);  // Should log "hello_world"
}
  // Should log "hello_world"
export const dataSourceOptions:DataSourceOptions ={
    type: "postgres",
    host: process.env.DB_HOST, // Host extracted from the connection string process.env.DB_HOST
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,// Password extracted from the connection string  process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE, // Database name extracted from the connection string 
    ssl: { rejectUnauthorized: false } , 
    migrations:[],
    entities:[UserEntity,CategoryEntity,ProductEntity,ReviewEntity,OrderEntity,OrdersProductsEntity,ShippingEntity],//[__dirname + '/entities/**/*.entity{.ts,.js}']:
    logging:false,
    synchronize:true

   
}
const dataSource= new DataSource(dataSourceOptions)
export default dataSource;