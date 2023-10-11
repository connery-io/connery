import { OpenAiService } from ':src/shared/openai.service';
import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import {
  ActionIdentifiedOutput,
  ActionNotIdentifiedOutput,
  ErrorResponse,
  ObjectResponse,
  RunActionWithPromptInput,
  RunActionWithPromptOutput1,
  RunActionWithPromptOutput2,
} from './types';

@Controller('/actions')
export class ActionsController {
  constructor(private openAiService: OpenAiService) {}

  // TODO: Deprecate this endpoint
  @Post('/run')
  async runAction(
    @Body() body: RunActionWithPromptInput,
  ): Promise<ObjectResponse<RunActionWithPromptOutput1> | ObjectResponse<RunActionWithPromptOutput2> | ErrorResponse> {
    try {
      const result = await this.openAiService.runAction(body.prompt);

      return {
        status: 'success',
        data: result,
      };
    } catch (error: any) {
      // TODO: Replace with proper solution
      throw new HttpException(
        {
          status: 'error',
          error: {
            message: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/identify')
  async identifyAction(
    @Body() body: RunActionWithPromptInput,
  ): Promise<ObjectResponse<ActionIdentifiedOutput | ActionNotIdentifiedOutput> | ErrorResponse> {
    try {
      const result = await this.openAiService.identifyAction(body.prompt);

      return {
        status: 'success',
        data: result,
      };
    } catch (error: any) {
      // TODO: Replace with proper solution
      throw new HttpException(
        {
          status: 'error',
          error: {
            message: error.message,
          },
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
