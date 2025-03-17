import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateProductDto {
    @IsNotEmpty({message:"title can not be blank"})
    @IsString()
    tittle:string

    @IsNotEmpty({message:"description can not be blank"})
    @IsString()
    description:string

    @IsNotEmpty({message:"price can not be blank"})
    price:number
    
    
    @IsNotEmpty({message:"stock can not be blank"})
    stocke:number

    @IsNotEmpty({message:"image can not be blank"})
    @IsArray({message:"image should be in array form"})
    image:string[]

    @IsNotEmpty({message:"categoryid can not be blank"})
    @IsNumber({},{message:"categry should be number"})
    categoryId:number;


}
