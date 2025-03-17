import { IsEmail, isEmail, IsNotEmpty, isNotEmpty, IsString, isString } from "class-validator";

export class UserSignupDto {

@IsNotEmpty({message:"name must not be empty"})
@IsString({ message: "name must be a string" })
name:string;

@IsNotEmpty({message:"name must not be  null"})
@IsEmail({}, { message: "please provide a valid email" }) // Correct usage
  email: string;

@IsNotEmpty({message:"password must not be empty"})
password:string;
}