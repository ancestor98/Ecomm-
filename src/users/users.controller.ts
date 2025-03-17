import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Req, UnauthorizedException, UseGuards, } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignupDto } from './dto/user-signu.dto';
import { UserSigninDto } from './dto/user-sigin.dto';
import { CurrentUser,  } from 'src/utility/decorators/current-user.decorators';
//import { CurrentUserMiddleware } from 'src/utility/middlewares/current-user.middleware';
import { Request, Response, NextFunction } from 'express';
import { Request as ExpressRequest } from 'express';  // ✅ Avoids conflicts
import { AuthenticationGuard,  } from 'src/utility/guards/authentication.guard';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { Roles } from 'src/utility/common/userrole.enum';
import { AuthorizeRolesGuard } from 'src/utility/guards/authorization.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("signup")
 async signup(@Body() usersignupDto: UserSignupDto):Promise<UserEntity> {
    return this.usersService.signup(usersignupDto);
  }

  @Post("signin")
  async signin(@Body() userSigninDto: UserSigninDto): Promise<{ accessToken: string; user: UserEntity }> {
      const user = await this.usersService.signin(userSigninDto);
  
      if (!user) {
          throw new BadRequestException("whats up the shit isnt here.");
      }
      const accessToken = await this.usersService.accessToken(user);
  
      return { accessToken, user }; 
  } 
  //@AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard,AuthorizeRolesGuard([Roles.ADMIN]))
  @Get("all")
  async findAll():Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }
@UseGuards(AuthenticationGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  

  // @Get("me")
  // getProfile(@Req() req: ExpressRequest) {
  //   console.log("Current User:", req.currentUser);
  //   if (!req.currentUser) {
  //     throw new UnauthorizedException("User not authenticated.");
  //   }

  //   return req.currentUser;
  // }
  @Get("currentuser/me")
  getProfile(@Req() req: Request) {
    console.log("🟢 Route Handler Executed - req.currentUser:", req.currentUser);
  
    if (!req.currentUser) {
      console.log(" No user found in @Req()!");
      throw new UnauthorizedException("User not authenticated.");
    }
  
    return req.currentUser;
  }
  
    
  }
  
 