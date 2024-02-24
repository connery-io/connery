import { Controller, Get, Inject } from '@nestjs/common';
import { Public } from ':src/api/auth.guard';
import { OpenAiFunctionSchema } from ':src/types/llm';
import { OpenAPIV3 } from 'openapi-types';
import { OpenAiSpecsService } from '../services/openai-specs.service';

@Controller()
export class OpenAiController {
  constructor(@Inject(OpenAiSpecsService) private openAiSpecsService: OpenAiSpecsService) {}

  // TODO
  @Public()
  @Get('/openai/schema-for-gpts')
  async getOpenApiSpec(): Promise<OpenAPIV3.Document> {
    return this.openAiSpecsService.getOpenApiSpec();
  }

  // TODO
  @Get('/openai/schema-for-assistants-api')
  async getFunctionsSpec(): Promise<OpenAiFunctionSchema[]> {
    return this.openAiSpecsService.getFunctionsSpec(true, null);
  }

  // TODO: implement API endpoints based on shortenned APIs for GPTs (if needed)
}
