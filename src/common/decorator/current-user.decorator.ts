import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CustomRequest } from '../interface/custom-request.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<CustomRequest>();
    return request.user;
  },
);
