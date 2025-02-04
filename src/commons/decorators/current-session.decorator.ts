import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentSession = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.session;
  },
);
