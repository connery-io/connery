import { Controller, Get } from '@nestjs/common';
import { OpenAiFunctionSchema } from '../../types/llm.js';
import { OpenAPIV3 } from 'openapi-types';
import { OpenAiSpecsService } from '../services/openai-specs.service.js';
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
import { GenericErrorResponse } from '../dto.js';

@ApiTags('Specs')
@ApiExtraModels(GenericErrorResponse)
@ApiInternalServerErrorResponse({
  description: 'Internal server error.',
  schema: {
    $ref: getSchemaPath(GenericErrorResponse),
  },
})
@ApiUnauthorizedResponse({
  description: 'Unauthorized.',
  schema: {
    $ref: getSchemaPath(GenericErrorResponse),
  },
})
@ApiSecurity('ApiKey')
@Controller('/specs')
export class OpenAiController {
  constructor(private openAiSpecsService: OpenAiSpecsService) {}

  @ApiOperation({
    summary: 'Get the "OpenAPI specification" for OpenAI GPTs.',
    description: 'Learn more: [Use Connery actions in OpenAI GPT](https://docs.connery.io/docs/clients/openai/gpt).',
  })
  @ApiOkResponse({
    description: 'The "OpenAPI specification" for OpenAI GPTs.',
  })
  @Get('/openai/gpts')
  async getOpenApiSpec(): Promise<OpenAPIV3.Document> {
    return this.openAiSpecsService.getOpenApiSpec();
  }

  @ApiOperation({
    summary: 'Get the "OpenAI Functions specification" for OpenAI Assistant API.',
    description:
      'Learn more: [Use Connery actions with OpenAI Assistants API](https://docs.connery.io/docs/clients/openai/assistant).',
  })
  @ApiOkResponse({
    description: 'The "OpenAI Functions specification" for OpenAI Assistant API.',
  })
  @Get('/openai/assistants-api')
  async getFunctionsSpec(): Promise<OpenAiFunctionSchema[]> {
    return this.openAiSpecsService.getFunctionsSpec();
  }
}
