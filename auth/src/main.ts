
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.select(AppConfigModule).get(AppConfigService);
  if (process.env.NODE_ENV === 'development') {
    // Enable CORS for development
    // Allow requests from the frontend application
    app.enableCors({
      origin: process.env.FRONTEND_PORTS.split(',').map(port => `http://localhost:${port}`),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
    });

    // Enable Swagger for API documentation
    // Set up Swagger for API documentation
    // The Swagger UI will be available at http://localhost:3000/api
    // The API documentation will be generated based on the decorators in the controllers and DTOs
    const swaggerPath = '/api';
    const config = new DocumentBuilder()
      .setTitle('Caidense Synth API')
      .setDescription('Provide a robust and systematic platform for managing, templating, testing, and evaluating Large Language Model (LLM) prompts. It aims to bring engineering rigor to the prompt development lifecycle, facilitating better collaboration, version control, testing, and optimization of prompts used in LLM-powered applications.')
      .setVersion('1.0')
      .addServer(`http://localhost:${process.env.HOST_PORT}/`, 'Local environment')
      .addTag('Caidense Synth')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
