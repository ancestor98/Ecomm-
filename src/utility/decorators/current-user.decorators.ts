import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log("🔹 CurrentUser Decorator - Request Object:", request);
    console.log("🔹 CurrentUser Decorator - Current User:", request.currentUser);
    //console.log("Decorator - Current User:", request.currentUser); // Debugging
    if (!request.currentUser) {
      console.log(" No user found in request.");
    }

    return request.currentUser; 
  }
);
