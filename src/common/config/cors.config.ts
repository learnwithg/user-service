import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CORS_OPTIONS: CorsOptions = {
  origin: ['*'],
  allowedHeaders:
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
  credentials: true,
};
