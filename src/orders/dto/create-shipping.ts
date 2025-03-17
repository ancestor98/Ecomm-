import { IsNotEmpty, IsString } from "class-validator";

export class CreateShippingDto{
    @IsNotEmpty({message:"phone can not be empty"})
    @IsString({message:"phone format should be string"})
    phone:string;

    @IsNotEmpty({message:"phone can not be empty"})
    @IsString({message:"phone format should be string"})
    name:string;

    @IsNotEmpty({message:"phone can not be empty"})
    @IsString({message:"phone format should be string"})
    address:string;

    @IsNotEmpty({message:"city can not be empty"})
    @IsString({message:"city format should be string"})
    city:string;

    @IsNotEmpty({message:"postCod can not be empty"})
    @IsString({message:"postCod format should be string"})
    postCode:string;


    @IsNotEmpty({message:"  state can not be empty"})
    @IsString({message:"  state format should be string"})
    state:string;

    @IsNotEmpty({message:"country can not be empty"})
    @IsString({message:"country format should be string"})
    country:string;

}