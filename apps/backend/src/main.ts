import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';
import { TransformInterceptor } from './common/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('M/S Rong Bahar API');
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: false,
    }),
  );

  // Cross-Origin Resource Sharing (Supports Namecheap domain, Vercel preview deploys, and local dev)
  const allowedOrigins = [
    'https://msrongbahar.me',
    'https://www.msrongbahar.me',
    'https://msrongbahar.com',
    'https://www.msrongbahar.com',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:4000',
  ];

  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
  }

  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server requests, mobile apps, or curl with no origin header
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1');

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for seamless client requests
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, Cache-Control',
  });

  // Global Prefix (exclude health and ping so Render and uptime monitors can hit /health directly)
  app.setGlobalPrefix('api', {
    exclude: ['health', 'ping'],
  });

  // Global Interceptors & Filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('M/S Rong Bahar E-Commerce Platform API')
    .setDescription(
      'High-performance backend API powering catalog browsing, Redis session carts, temporary inventory locking, and PostgreSQL checkout orders.',
    )
    .setVersion('2.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Backend Server running at http://localhost:${port}`);
  logger.log(`📚 Swagger Documentation active at http://localhost:${port}/api/docs`);
}

bootstrap();
