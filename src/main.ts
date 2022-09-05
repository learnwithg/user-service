import { PrismaClientService } from '@app/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

function list(payload: string) {
  if (!payload) return [];

  return payload.split('|').filter((x: string) => x);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  function envv(key: string) {
    return configService.get(key);
  }

  const auth_port = envv('AUTH_PORT');
  const brokers = envv('BROKERS');
  const cors_origins = envv('CORS_ORIGINS');
  const allowed_headers = envv('ALLOWED_HEADERS');
  const allowed_methods = envv('ALLOWED_METHODS');
  const cors_credentials = envv('CORS_ALLOW_CREDENTIALS');
  const app_enable_cookies = envv('APP_ENABLE_COOKIES');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: list(brokers),
      },
      consumer: {
        groupId: envv('CONSUMER_ID'),
      },
    },
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enable('trust proxy');

  app.enableCors({
    origin: list(cors_origins),
    allowedHeaders: allowed_headers,
    methods: allowed_methods,
    credentials: ['1', 'true'].includes(cors_credentials),
  });

  if (['1', 'true'].includes(app_enable_cookies)) {
    app.use(cookieParser());
  }

  app.use(csurf());
  app.use(helmet.contentSecurityPolicy());
  app.use(helmet.crossOriginEmbedderPolicy());
  app.use(helmet.crossOriginOpenerPolicy());
  app.use(helmet.crossOriginResourcePolicy());
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.expectCt());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.originAgentCluster());
  app.use(helmet.permittedCrossDomainPolicies());
  app.use(helmet.referrerPolicy());
  app.use(helmet.xssFilter());
  app.use(compression());

  const prismaClientService: PrismaClientService = app.get(PrismaClientService);

  prismaClientService.enableShutdownHooks(app);

  await app.startAllMicroservices();

  await app.listen(Number(Number(auth_port) || 3000));
}
bootstrap();
