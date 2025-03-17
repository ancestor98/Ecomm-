import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
//import { UserEntity } from '../entities/user.entity'; // Adjust path based on your project structure

export interface ExpressRequest extends Request {
  user?: UserEntity; // Add `user` property for Passport authentication
  currentUser?: UserEntity; // If you are using `currentUser`
}
