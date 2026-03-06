import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserContextDto } from 'src/lib/dtos/user_context.dto';

export const UserContext = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserContextDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.context;
  },
);
