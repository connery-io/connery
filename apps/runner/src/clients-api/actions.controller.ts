import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ILlm } from ':src/shared/llm/llm.interface';
import { ActionIdentifiedOutput, ActionNotIdentifiedOutput, OpenAiFunctionSchema } from ':src/shared/llm/types';
import {
  ActionResponseType,
  IdentifyActionRequest,
  ObjectResponse,
  PaginatedResponse,
  RunActionRequest,
  convertAction,
} from ':src/shared/api-types';
import { OpenApiService } from ':src/shared/openapi.service';
import { IOpenAI } from ':src/shared/llm/openai.interface';
import { OpenAPIV3 } from 'openapi-types';
import { IPluginCache } from ':src/shared/plugin-cache/plugin-cache.interface';
import { ActionOutput } from 'lib';
import { Public } from ':src/shared/auth.guard';
import { ApiTags, ApiSecurity, ApiOperation } from '@nestjs/swagger';

@ApiTags('Actions')
@Controller()
export class ActionsController {
  constructor(
    @Inject(IPluginCache) private pluginCache: IPluginCache,
    @Inject(ILlm) private llm: ILlm,
    @Inject(IOpenAI) private openAi: IOpenAI,
    @Inject(OpenApiService) private openApiService: OpenApiService,
  ) {}

  @ApiSecurity('ApiKey')
  @ApiOperation({
    summary: 'Get a list of actions installed on the runner.',
    description: 'Get a list of actions installed on the runner.',
  })
  @Get('/v1/actions')
  async getActions(): Promise<PaginatedResponse<ActionResponseType>> {
    const actions = await this.pluginCache.getActions();

    return {
      status: 'success',
      data: actions.map(convertAction),
    };
  }

  @ApiSecurity('ApiKey')
  @ApiOperation({
    summary: 'Get an action by ID.',
    description: 'Get an action by ID.',
  })
  @Get('/v1/actions/:actionId')
  async getAction(@Param('actionId') actionId: string): Promise<ObjectResponse<ActionResponseType>> {
    const action = await this.pluginCache.getAction(actionId);

    return {
      status: 'success',
      data: convertAction(action),
    };
  }

  @ApiSecurity('ApiKey')
  @ApiOperation({
    summary: 'Identify an action and its inputs based on a natural language prompt.',
    description: 'Identify an action and its inputs based on a natural language prompt.',
  })
  @Post('/v1/actions/identify')
  async identifyAction(
    @Body() body: IdentifyActionRequest,
  ): Promise<ObjectResponse<ActionIdentifiedOutput | ActionNotIdentifiedOutput>> {
    const result = await this.llm.identifyAction(body.prompt);

    return {
      status: 'success',
      data: result,
    };
  }

  @ApiSecurity('ApiKey')
  @ApiOperation({
    summary: 'Run an action.',
    description: 'Run an action.',
  })
  @Post('/v1/actions/:actionId/run')
  async runAction(
    @Param('actionId') actionId: string,
    @Body() body: RunActionRequest,
  ): Promise<ObjectResponse<ActionOutput>> {
    const action = await this.pluginCache.getAction(actionId);
    const identifiedInputFromPrompt = await this.llm.identifyActionInput(action, body.prompt);
    const result = await action.run(body.input, identifiedInputFromPrompt);

    return {
      status: 'success',
      data: result,
    };
  }

  @ApiOperation({
    summary: 'Get the OpenAPI specification of actions for OpenAI GPT.',
    description:
      'This specification is used by the OpenAI GPT to run actions from the runner. Learn more: [Use Connery actions in OpenAI GPT](https://docs.connery.io/docs/clients/native/openai/gpt).',
  })
  @Public()
  @Get('/v1/actions/specs/openapi')
  async getActionsOpenApi(): Promise<OpenAPIV3.Document> {
    return this.openApiService.getOpenApiSpecForActions();
  }

  @ApiSecurity('ApiKey')
  @ApiOperation({
    summary: 'Get the OpenAI specification of actions for OpenAI Assistant API.',
    description:
      'This specification is used by the OpenAI Assistant API to run actions from the runner. Learn more: [Use Connery actions in OpenAI Assistant API](https://docs.connery.io/docs/clients/native/openai/assistant).',
  })
  @Get('/v1/actions/specs/openai-functions')
  async getOpenAiFunctionsSchemaForActions(): Promise<OpenAiFunctionSchema[]> {
    return this.openAi.getOpenAiFunctionsSpec(true);
  }
}
