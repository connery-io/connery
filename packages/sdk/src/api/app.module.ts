import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ActionsController } from './controllers/actions.controller.js';
import { PluginController } from './controllers/plugin.controller.js';
import { ToolsController } from './controllers/tools.controller.js';
import { OpenAiSpecsService } from './services/openai-specs.service.js';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard.js';
import { OpenAiController } from './controllers/specs.controller.js';
import { PluginService } from './services/plugin.service.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, dirname } from 'path';
import { PluginConfigService } from './services/plugin-config.service.js';
import { validateEnvConfig } from './utils/env-config-utils.js';

@Module({
  imports: [
    ConfigModule.forRoot({ validate: validateEnvConfig }),
    ConfigModule,
    ServeStaticModule.forRoot({
      rootPath: join(dirname(new URL(import.meta.url).pathname), 'static'),
    }),
  ],
  controllers: [ActionsController, OpenAiController, PluginController, ToolsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    OpenAiSpecsService,
    PluginService,
    PluginConfigService,
  ],
})
export class AppModule {}
