import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty({message:"title must not be empty"})
    @IsString({ message: "title must be a string" })
    title:string;

    @IsNotEmpty({message:"desription must not be empty"})
    @IsString({ message: "desription must be a string" })
     desription:string;
}
