import { Controller, Get, Inject, Param } from '@nestjs/common';
import { IPluginCache } from ':src/shared/plugin-cache/plugin-cache.interface';
import {
  ObjectResponse,
  PaginatedResponse,
  PluginListResponseType,
  PluginResponseType,
  convertPlugin,
  convertPluginForList,
} from ':src/shared/api-types';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';

@ApiTags('Plugins')
@ApiSecurity('ApiKey')
@Controller()
export class PluginsController {
  constructor(@Inject(IPluginCache) private pluginCache: IPluginCache) {}

  //
  // Public methods
  //

  @ApiOperation({
    summary: 'Get a list of plugins installed on the runner.',
    description: 'Get a list of plugins installed on the runner.',
  })
  @Get('/v1/plugins')
  async getPluginsV1(): Promise<PaginatedResponse<PluginListResponseType>> {
    const plugins = await this.pluginCache.getPlugins();

    return {
      status: 'success',
      data: plugins.map(convertPluginForList),
    };
  }

  @ApiOperation({
    summary: 'Get a plugin by ID.',
    description: 'Get a plugin by ID.',
  })
  @Get('/v1/plugins/:pluginId')
  async getPluginV1(@Param('pluginId') pluginId: string): Promise<ObjectResponse<PluginResponseType>> {
    const plugin = await this.pluginCache.getPlugin(pluginId);

    return {
      status: 'success',
      data: convertPlugin(plugin),
    };
  }
}
