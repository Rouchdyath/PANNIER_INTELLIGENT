import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration de la validation globale
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configuration CORS pour le frontend React
  const allowedOrigins: (string | RegExp)[] = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ];

  // Ajouter l'URL du frontend en production si définie
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  // En production, accepter les domaines Vercel
  if (process.env.NODE_ENV === 'production') {
    allowedOrigins.push(/\.vercel\.app$/);
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application démarrée sur le port ${port}`);
}
bootstrap();
