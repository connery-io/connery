import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { PluginService } from '../services/plugin.service.js';
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  GenericObjectResponse,
  GenericPaginatedResponse,
  Action,
  RunActionRequest,
  RunActionResponse,
  GenericErrorResponse,
} from '../dto.js';

@ApiTags('Actions')
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
@Controller('/actions')
export class ActionsController {
  constructor(private pluginService: PluginService) {}

  @ApiOperation({
    summary: 'List all actions from the plugin.',
    description: 'List all actions from the plugin.',
  })
  @ApiExtraModels(GenericPaginatedResponse, Action)
  @ApiOkResponse({
    description: 'The list of actions.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(GenericPaginatedResponse) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(Action),
              },
            },
          },
        },
      ],
    },
  })
  @Get('/')
  getActions(): GenericPaginatedResponse<Action> {
    const actions = this.pluginService.plugin.actions;

    return {
      status: 'success',
      data: actions.map((action) => new Action(action)),
    };
  }

  @ApiOperation({
    summary: 'Get action.',
    description: 'Get action.',
  })
  @ApiExtraModels(GenericObjectResponse, Action, GenericErrorResponse)
  @ApiOkResponse({
    description: 'The action details.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(GenericObjectResponse) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(Action),
            },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'Action not found.',
    schema: {
      $ref: getSchemaPath(GenericErrorResponse),
    },
  })
  @Get('/:key')
  getAction(@Param('key') key: string): GenericObjectResponse<Action> {
    const action = this.pluginService.plugin.findActionByKey(key);

    if (!action) {
      throw new HttpException('Action not found.', 404);
    }

    return {
      status: 'success',
      data: new Action(action),
    };
  }

  @ApiOperation({
    summary: 'Run action.',
    description: 'Run an action with the given input and configuration.',
  })
  @ApiExtraModels(GenericObjectResponse, RunActionResponse, GenericErrorResponse)
  @ApiOkResponse({
    description: 'The result of the action run.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(GenericObjectResponse) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(RunActionResponse),
            },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'Action not found.',
    schema: {
      $ref: getSchemaPath(GenericErrorResponse),
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
    schema: {
      $ref: getSchemaPath(GenericErrorResponse),
    },
  })
  @Post('/:key/run')
  async runAction(
    @Param('key') key: string,
    @Body() body: RunActionRequest,
  ): Promise<GenericObjectResponse<RunActionResponse>> {
    const action = this.pluginService.plugin.findActionByKey(key);

    if (!action) {
      throw new HttpException('Action not found.', 404);
    }

    // TODO: get default config from the ENV config
    // TODO: throw validation errors as HTTP 400
    const defaultConfiguration = {};
    const result = await action.run(body.input, defaultConfiguration, body.configuration);

    return {
      status: 'success',
      data: result,
    };
  }
}
