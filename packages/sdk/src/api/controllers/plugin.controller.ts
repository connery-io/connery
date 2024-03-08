import { Controller, Get } from '@nestjs/common';
import { PluginService } from '../services/plugin.service.js';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { GenericErrorResponse, GenericObjectResponse, Plugin } from '../dto.js';

@ApiTags('Plugin')
@ApiSecurity('ApiKey')
@ApiExtraModels(GenericErrorResponse)
@ApiUnauthorizedResponse({
  description: 'Unauthorized.',
  schema: {
    $ref: getSchemaPath(GenericErrorResponse),
  },
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error.',
  schema: {
    $ref: getSchemaPath(GenericErrorResponse),
  },
})
@Controller('/plugin')
export class PluginController {
  constructor(private pluginService: PluginService) {}

  @ApiOperation({
    summary: 'Get the plugin details.',
    description: 'Get the plugin details.',
  })
  @ApiExtraModels(GenericObjectResponse, Plugin)
  @ApiOkResponse({
    description: 'The plugin details.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(GenericObjectResponse) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(Plugin),
            },
          },
        },
      ],
    },
  })
  @Get('/')
  getPlugin(): GenericObjectResponse<Plugin> {
    return {
      status: 'success',
      data: new Plugin(this.pluginService.plugin),
    };
  }
}
