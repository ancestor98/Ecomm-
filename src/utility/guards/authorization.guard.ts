import { CanActivate, ExecutionContext, Injectable, mixin, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

// @Injectable()
// export class AuthorizeRolesGuard implements CanActivate{

//     constructor(private reflector:Reflector){}
//     canActivate(context: ExecutionContext): boolean{
//         const allowedRoles=this.reflector.get<string[]>("allowedRoles",context.getHandler());
//          if (!allowedRoles) {
//             return true;  
//     }
//         const request =context.switchToHttp().getRequest();
//         const result=request?.currentUser?.roles.map((role:string)=>allowedRoles.includes(role)).find
//         ((val:boolean)=>val===true);
//         if(result) return true;
//         throw new UnauthorizedException("sorry nigga you not authorized here baby")
        
//     }
// }


export const  AuthorizeRolesGuard=(allowedRoles:string[])=>{

    class RolesGuardMixin implements CanActivate{
    canActivate(context: ExecutionContext): boolean{
        
        const request =context.switchToHttp().getRequest();
       //const hasRole= request?.currentUser?.roles.some((role: string) => allowedRoles.includes(role))

        const result=request?.currentUser?.roles.map((role:string)=>allowedRoles.includes(role)).find
        ((val:boolean)=>val===true);
        if(result) return true;
        throw new UnauthorizedException("sorry nigga you not authorized here baby")
        
    }
}
const guard=mixin(RolesGuardMixin)
return guard
}