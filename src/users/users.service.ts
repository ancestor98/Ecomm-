import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { promises } from 'dns';
import { UserSignupDto } from './dto/user-signu.dto';
import * as bcrypt from 'bcrypt';
//import { hash } from 'crypto';
import { hash, compare } from 'bcrypt';
import { UserSigninDto } from './dto/user-sigin.dto';
import { sign } from 'jsonwebtoken';
import { NotFoundError } from 'rxjs';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository:Repository<UserEntity>
  ){}
  
  async signup(usersignup:UserSignupDto): Promise<UserEntity>{
    const existinguser= await this .findUserByMail(usersignup.email)
    if(existinguser) throw new BadRequestException("yoo you vant use this email")
      usersignup.password= await hash(usersignup.password,10)
    let user =this.usersRepository.create(usersignup)
    user= await this.usersRepository.save(user)
    delete user.password
    return user;
    
  }

  async signin(usersignin: UserSigninDto): Promise<UserEntity> {

    const userExist= await this.usersRepository.createQueryBuilder("users").addSelect("users.password").where("users.email=:email"
      ,{email:usersignin.email}).getOne();
       if (!userExist || !userExist.password) {
         throw new BadRequestException("User data is incomplete or missing password.");
       }
      const matchPassword = await compare(usersignin.password, userExist.password);
    console.log(matchPassword)

       if (!matchPassword) {
         throw new BadRequestException("nigga you dem password dosnt match.");
       }
    
      delete userExist.password
      return userExist;
    
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

 async  findAll():Promise<UserEntity[]> {
    return await this.usersRepository.find()
  }

  async findOne(id: number): Promise<UserEntity> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid user ID');
    }
  
    const user = await this.usersRepository.findOneBy({ id });
  
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  
    return user;
  }
  
  

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByMail(email:string):Promise<UserEntity> {
    return  await this.usersRepository.findOneBy({email})
  }

  async accessToken(user:UserEntity){
    return sign({
      id:user.id,email:user.email},process.env.ACCESS_TOKEN_SECRET_KEY,{expiresIn:"1d"})
  }
}
