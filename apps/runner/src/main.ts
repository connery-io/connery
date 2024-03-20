import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  // Create the NestJS application.
  // CORS is required for the OpenAPI specification.
  const app = await NestFactory.create(AppModule, { cors: true });

  // Init OpenAPI specification.
  const config = new DocumentBuilder()
    .setTitle('Connery Runner API')
    .setDescription('This is the OpenAPI specification for the Connery Runner API.')
    .setVersion('v1')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'ApiKey')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  document.externalDocs = {
    description: 'Connery documentation.',
    url: 'https://docs.connery.io/',
  };

  SwaggerModule.setup('api', app, document);

  // Init global exception filter to handle all exceptions.
  app.useGlobalFilters(new AllExceptionsFilter());

  // Start the runner.
  const runnerPort = 4201;
  await app.listen(runnerPort);
  console.log(`✅ Runner is successfully started on port ${runnerPort}`);
}
bootstrap();
