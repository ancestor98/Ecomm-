import { IsEmail, IsNotEmpty } from "class-validator";
import { UserSignupDto } from "./user-signu.dto";

export  class UserSigninDto  {
    @IsNotEmpty({message:"name must not be  null"})
    @IsEmail({}, { message: "please provide a valid email" }) // Correct usage
      email: string;
    
    @IsNotEmpty({message:"password must not be empty"})
    password:string;

}