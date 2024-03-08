import { Public } from '../auth.guard.js';
import { Controller, Get } from '@nestjs/common';
import {
  ApiSecurity,
  ApiTags,
  ApiOperation,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  getSchemaPath,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { GenericErrorResponse, GenericObjectResponse } from '../dto.js';

@ApiTags('Tools')
@ApiExtraModels(GenericErrorResponse)
@ApiInternalServerErrorResponse({
  description: 'Internal server error.',
  schema: {
    $ref: getSchemaPath(GenericErrorResponse),
  },
})
@Controller()
export class ToolsController {
  @ApiOperation({
    summary: 'Check if the plugin is healthy.',
    description: 'Check if the plugin is healthy.',
  })
  @ApiOkResponse({
    description: 'The request is authenticated.',
    schema: {
      $ref: getSchemaPath(GenericObjectResponse),
    },
  })
  @Public()
  @Get('/health')
  async health(): Promise<GenericObjectResponse<undefined>> {
    return {
      status: 'success',
      data: undefined,
    };
  }

  @ApiOperation({
    summary: 'Verify if the request is authenticated.',
    description: 'Verify if the request is authenticated.',
  })
  @ApiOkResponse({
    description: 'The request is authenticated.',
    schema: {
      $ref: getSchemaPath(GenericObjectResponse),
    },
  })
  @ApiExtraModels(GenericErrorResponse)
  @ApiUnauthorizedResponse({
    description: 'Unauthorized.',
    schema: {
      $ref: getSchemaPath(GenericErrorResponse),
    },
  })
  @ApiSecurity('ApiKey')
  @Get('/verify-access')
  verifyAccess(): GenericObjectResponse<undefined> {
    // By default every API endpoint is protected by the AuthGuard. Including this one.
    // And the AuthGuard will throw an exception if the request is not authenticated.
    // This endpoint does not contain any business logic, it is only used to verify if the request is authenticated by the clients.

    return {
      status: 'success',
      data: undefined,
    };
  }
}
