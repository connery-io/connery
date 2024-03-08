import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './all-exceptions.filter.js';
import { PluginDefinition } from '../types/definition.js';
import { Plugin } from '../core/plugin.js';
import { PluginService } from './services/plugin.service.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { PluginConfigService } from './services/plugin-config.service.js';

export async function startPluginServer(pluginDefinition: PluginDefinition) {
  const app = await NestFactory.create(AppModule, {
    cors: true, // CORS is required for the OpenAPI specification
    logger: false,
  });

  app.setGlobalPrefix('api');

  initPlugin(app, pluginDefinition);
  await initOpeApiSpec(app);

  app.useGlobalFilters(new AllExceptionsFilter());

  const runnerPort = 4201;
  await app.listen(runnerPort);
  console.log(`✅ The plugin server is running on port ${runnerPort}`);
}

function initPlugin(app: INestApplication, pluginDefinition: PluginDefinition) {
  const plugin = new Plugin(pluginDefinition);
  const pluginService = app.get(PluginService);
  pluginService.plugin = plugin;
}

async function initOpeApiSpec(app: INestApplication) {
  const pluginConfigService = app.get(PluginConfigService);

  const config = new DocumentBuilder()
    .setTitle('Plugin API')
    .setDescription('This is a standartized API for the Connery plugin and its actions.')
    .setVersion(await pluginConfigService.getSdkVersion())
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'ApiKey')
    .addTag('Plugin')
    .addTag('Actions')
    .addTag('Specs', 'Action specifications for different clients.')
    .addTag('Tools', 'Different tooling endpoints.')
    .addServer(pluginConfigService.pluginUrl, 'Plugin URL')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customfavIcon: '',
    customSiteTitle: 'Plugin API',
    customCss: `
      .swagger-ui .topbar { display: none } `,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
