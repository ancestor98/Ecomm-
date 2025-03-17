// import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
// import { isArray } from 'class-validator';
// import { Request, Response, NextFunction } from 'express';
// import { verify, JwtPayload } from 'jsonwebtoken';
// import { UserEntity } from 'src/users/entities/user.entity';
// import { UsersService } from 'src/users/users.service';
// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: UserEntity | null;
//     }
//   }
// }

// @Injectable()
// export class CurrentUserMiddleware implements NestMiddleware {
//   private readonly logger = new Logger(CurrentUserMiddleware.name);

//   constructor(private readonly usersService: UsersService) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     try {
//       const authHeader = req.headers.authorization || req.headers.Authorization;
      
//       if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
//         this.logger.warn('No or invalid Authorization header');
//         req.currentUser = null;
//         return next();
//       }

//       const token = authHeader.split(' ')[1];
//       //console.log(token)
      

//       // Verify token
//       let decoded: JwtPayload;
//       try {
       
       
//         decoded = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY) as JwtPayload;
//         console.log("Decoded JWT:", decoded);

//       } catch (error) {
//         this.logger.error('Invalid or expired token', error.message);
//         req.currentUser = null;
//         return next();
//       }

//       if (!decoded.id) {
//         this.logger.warn('Invalid token payload: missing user ID');
//         req.currentUser = null;
//         return next();
//       }

//       // Fetch the user
//       const currentUser = await this.usersService.findOne(+decoded.id);
//       //console.log("Current User in Middleware:", currentUser);

//       if (!currentUser) {
//         this.logger.warn(`User with ID ${decoded.id} not found`);
//         req.currentUser = null;
//       } else {
//         req.currentUser = currentUser;
//         console.log("Current User set in middleware:", req.currentUser);
//       }

//       return next();
//     } catch (error) {
//       this.logger.error('Unexpected error in CurrentUserMiddleware', error.message);
//       req.currentUser = null;
//       return next();
//     }
//   }
// }




import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserEntity | null;
        }
    }
}

interface JwtPayload {
    id: string;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        //console.log("🔹 Middleware triggered on:", req.url);
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || isArray(authHeader) || !authHeader.startsWith("Bearer ")) {
            //console.log("No or invalid Authorization header");
            req.currentUser = null;
            return next();
        }

        try {
            const token = authHeader.split(" ")[1];
           // console.log("🔹 Extracted Token:", token);

            if (!process.env.ACCESS_TOKEN_SECRET_KEY) {
                console.error("ACCESS_TOKEN_SECRET_KEY is not defined");
                req.currentUser = null;
                return next();
            }

            const { id } = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY) as JwtPayload;
            const userId = Number(id); // Convert to number

    if (isNaN(userId)) {
      console.error("Invalid user ID from JWT:", id);
      req.currentUser = null;
      return next();
      
    }

            const currentUser = await this.usersService.findOne(userId)
            if (!currentUser) {
                console.log("User not found");
                req.currentUser = null;
            } else {
                req.currentUser = currentUser;
            }

            return next();
        } catch (err) {
            console.error("Token verification failed:", err.message);
            req.currentUser = null;
            return next();
        }
    }
}
