import { Public } from ':src/shared/auth.guard';
import { ObjectResponse } from ':src/shared/api-types';
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';

@ApiTags('Tools')
@Controller()
export class ToolsController {
  @ApiOperation({
    summary: 'Root endpoint which returns a welcome message.',
    description: 'It is helpful for the users to verify if the runner is available from the browser.',
  })
  @Public()
  @Get('/')
  get(): ObjectResponse<{ message: string }> {
    return {
      status: 'success',
      data: {
        message: 'Welcome to the Connery Runner API 👋',
      },
    };
  }

  @ApiSecurity('ApiKey')
  @ApiOperation({
    summary: 'Verify if the request is authenticated.',
    description: 'It is helpful for the clients to verify if the request is properly authenticated.',
  })
  @Get('/v1/verify-access')
  verifyAccessV1(): ObjectResponse<undefined> {
    return this.verifyAccess();
  }

  private verifyAccess(): ObjectResponse<undefined> {
    // By default every API endpoint is protected by the AuthGuard. Including this one.
    // And the AuthGuard will throw an exception if the request is not authenticated.
    // This endpoint does not contain any business logic, it is only used to verify if the request is authenticated by the clients.

    return {
      status: 'success',
      data: undefined,
    };
  }
}
