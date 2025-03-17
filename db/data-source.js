"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../src/users/entities/user.entity");
const dotenv = require("dotenv");
const category_entity_1 = require("../src/categories/entities/category.entity");
const product_entity_1 = require("../src/products/entities/product.entity");
const review_entity_1 = require("../src/reviews/entities/review.entity");
const order_entity_1 = require("../src/orders/entities/order.entity");
const orders_products_1 = require("../src/orders/entities/orders-products");
const shipping_entity_1 = require("../src/orders/entities/shipping.entity");
const result = dotenv.config();
if (result.error) {
    console.log('Error loading .env file:', result.error);
}
else {
    console.log('DB_TEST:', process.env.DB_TEST);
}
exports.dataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: false },
    migrations: [],
    entities: [user_entity_1.UserEntity, category_entity_1.CategoryEntity, product_entity_1.ProductEntity, review_entity_1.ReviewEntity, order_entity_1.OrderEntity, orders_products_1.OrdersProductsEntity, shipping_entity_1.ShippingEntity],
    logging: false,
    synchronize: true
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=data-source.js.map