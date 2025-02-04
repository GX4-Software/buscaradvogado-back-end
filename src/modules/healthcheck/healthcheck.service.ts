import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthcheckService {
  healthcheck() {
    return {
      status: 'ok',
    };
  }
}
