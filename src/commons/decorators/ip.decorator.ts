import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as requestIp from '@supercharge/request-ip';

export const Ip = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return requestIp.getClientIp(request);
  },
);
