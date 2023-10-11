import { Inject } from '@nestjs/common';
import { ActionSchemaType } from 'lib';
import { ConnectorsService } from ':src/shared/connectors.service';
import { Configuration, OpenAIApi } from 'openai';
import { LocalConfigService } from ':src/shared/local-config.service';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from 'langchain/schema';

// TODO: replace with the shared type(s),
// the same that is used in the API response
// TODO: Deprecate this method
export type RunActionOutput = {
  response: string;
  output?: {
    [key: string]: string;
  };
  used: {
    prompt: string;
    connectorKey?: string;
    actionKey?: string;
    inputParameters?: {
      [key: string]: string;
    };
  };
};

// TODO: replace with the shared type(s),
// the same that is used in the API response

// TODO: add missing required input parameters, and all the other parameters that are not required
export type ActionIdentifiedOutput = {
  identified: true;
  connectorKey: string;
  actionKey: string;
  inputParameters: {
    [key: string]: string;
  };
  used: {
    prompt: string;
  };
};

// TODO: replace with the shared type(s),
// the same that is used in the API response
export type ActionNotIdentifiedOutput = {
  identified: false;
  used: {
    prompt: string;
  };
};

export class OpenAiService {
  constructor(
    @Inject(ConnectorsService) private connectorsService: ConnectorsService,
    private configService: LocalConfigService,
  ) {}

  // TODO: Deprecate this method
  async runAction(prompt: string): Promise<RunActionOutput> {
    if (!prompt) {
      throw new Error("Input parameter 'prompt' is required but the value is empty or not provided");
    }

    console.log(JSON.stringify({ type: 'user_prompt_received', data: { prompt: prompt } }));

    const runnerConfig = this.configService.getRunnerConfig();

    if (!runnerConfig.OpenAiApiKey) {
      throw new Error('The OPENAI_API_KEY is not configured on the runner.');
    }

    const configuration = new Configuration({
      apiKey: runnerConfig.OpenAiApiKey,
    });

    const exposedActions = await this.getExposedActionsJsonSchema();

    // Ask OpenAI to classify the user prompt based on the exposed actions
    const openai = new OpenAIApi(configuration);
    const completion1 = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        { role: 'system', content: this.getGenearlSystemInstructions() },
        { role: 'user', content: prompt },
      ],
      functions: exposedActions,
    });
    const result1 = completion1.data.choices[0];

    console.log(JSON.stringify({ type: 'openai_response_1', data: result1 }));

    if (
      result1.finish_reason === 'function_call' &&
      result1.message?.function_call?.name &&
      result1.message?.function_call?.arguments
    ) {
      // If OpenAI classified the user prompt as a function call, run the action

      const actionKey = result1.message.function_call.name;
      const actionArguments = JSON.parse(result1.message.function_call.arguments);

      // Run the action
      const action = await this.connectorsService.getAction(actionKey);

      let actionResult;
      try {
        actionResult = await action.runAction(actionArguments);
      } catch (error: any) {
        throw new Error(error.message);
      }

      console.log(JSON.stringify({ type: 'action_result', data: actionResult }));

      // Ask OpenAI to generate response for the user based on the action result
      const completion2 = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-0613',
        messages: [
          {
            role: 'system',
            content: this.getGenearlSystemInstructions(),
          },
          { role: 'user', content: prompt },
          {
            role: result1.message.role,
            content: result1.message.content,
            function_call: {
              name: result1.message.function_call.name,
              arguments: result1.message.function_call.arguments,
            },
          },
          { role: 'function', name: actionKey, content: this.getResultInstructions(action.schema, actionResult) },
        ],
      });

      const result2 = completion2.data.choices[0];
      console.log(JSON.stringify({ type: 'openai_response_2', data: result2 }));

      return {
        response: result2.message?.content ?? '',
        output: actionResult.output,
        used: {
          prompt: prompt,
          connectorKey: actionResult.usedConnectorKey,
          actionKey: actionResult.usedActionKey,
          inputParameters: actionResult.usedInputParameters,
        },
      };
    } else {
      // If OpenAI classified the user prompt as a regular message, return it to the user

      return {
        response: result1.message?.content ?? '',
        used: {
          prompt: prompt,
        },
      };
    }
  }

  async identifyAction(prompt: string): Promise<ActionIdentifiedOutput | ActionNotIdentifiedOutput> {
    // TODO implement

    console.log(JSON.stringify({ type: 'user_prompt_received', data: { prompt: prompt } }));

    const runnerConfig = this.configService.getRunnerConfig();
    if (!runnerConfig.OpenAiApiKey) {
      throw new Error('The OPENAI_API_KEY is not configured on the runner.');
    }

    const model = new ChatOpenAI({
      openAIApiKey: runnerConfig.OpenAiApiKey,
      modelName: 'gpt-3.5-turbo-0613',
    });

    const exposedActions = await this.getExposedActionsJsonSchema();
    const result = await model.call([new HumanMessage(prompt)], {
      functions: exposedActions,
    });

    const functionCall = result.additional_kwargs.function_call;
    if (!functionCall) {
      return {
        identified: false,
        used: {
          prompt,
        },
      };
    }

    let action;
    try {
      action = await this.connectorsService.getAction(functionCall.name);
    } catch (error) {
      return {
        identified: false,
        used: {
          prompt,
        },
      };
    }

    // TODO: Handle the case when the required parameters are not provided for the action
    const inputParameters = JSON.parse(functionCall.arguments);

    return {
      identified: true,
      connectorKey: action.connector.key,
      actionKey: action.key,
      inputParameters,
      used: {
        prompt,
      },
    };
  }

  // TODO: Deprecate this method
  private getResultInstructions(actionSchema: ActionSchemaType, actionResult: object): string {
    const parametersInfo: string[] = [];

    for (const outputParameter of actionSchema.outputParameters) {
      parametersInfo.push(`
        - Key: ${outputParameter.key}
          Title: ${outputParameter.title}
          Description: ${outputParameter.description}
      `);
    }

    return `
      [Instructions for the assistant, not for the user]

      Instructions about the result:
      - Result is always a stringified JSON that should be unwrapped and converted to the readeable format for the user.
      - In case of error, show the exact error message text to the user.
      - Always respond to the user using the language that the user used in the prompt.
      
      Action description for the additional context:
      - Key: ${actionSchema.key}
        Title: ${actionSchema.title}
        Description: ${actionSchema.description}

      Output parameters description for the additional context: 
      ${parametersInfo.join('\n')}

      [Result for the user]
      ${JSON.stringify(actionResult)}
    `;
  }

  // TODO: Deprecate this method
  private getGenearlSystemInstructions(): string {
    return `
      You are a helpful assistant.
      Your task is to help the user to run functions from Connery.
      Connery is a connector platform. Connector is a set of actions (functions) that can be run by the user. 
      Always "actions" term instead of "functions" when talking to the user.
      If the user asks to run an action, but not all the required input parameters are provided, ask the user to provide the missing input parameters, and never set the values of the input parameters by yourself.
    `;
  }

  private async getExposedActionsJsonSchema() {
    const exposedActions = [];

    const actions = await this.connectorsService.getActions();

    for (const action of actions) {
      const actionJsonSchema = this.convertActionToJsonSchema(action.schema);
      exposedActions.push(actionJsonSchema);
    }

    return exposedActions;
  }

  private convertActionToJsonSchema(action: ActionSchemaType) {
    const actionJsonSchema: any = {
      name: action.key,
      description: action.description,
    };
    actionJsonSchema.parameters = { type: 'object', properties: {}, required: [] };

    for (const inputParameter of action.inputParameters) {
      actionJsonSchema.parameters.properties[inputParameter.key] = {
        type: inputParameter.type,
        description: inputParameter.description,
      };

      if (inputParameter.validation && inputParameter.validation.required) {
        actionJsonSchema.parameters.required.push(inputParameter.key);
      }
    }

    return actionJsonSchema;
  }
}
