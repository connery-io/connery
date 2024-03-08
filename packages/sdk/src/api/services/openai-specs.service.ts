import { Injectable } from '@nestjs/common';
import { OpenAPIV3 } from 'openapi-types';
import { OpenAiFunctionSchema } from '../../types/llm.js';
import { PluginService } from './plugin.service.js';
import { PluginConfigService } from './plugin-config.service.js';
import { ConfigurationParameter, InputParameter, OutputParameter } from '../dto.js';

interface ExtendedOperationObject extends OpenAPIV3.OperationObject {
  // This custom extension property is used by OpenAI Actions to determine if the action requires a confirmation before running.
  // See more details here: https://platform.openai.com/docs/actions/consequential-flag
  'x-openai-isConsequential'?: boolean;
}

// TODO
@Injectable()
export class OpenAiSpecsService {
  constructor(private pluginConfigService: PluginConfigService, private pluginService: PluginService) {}

  // TODO
  async getOpenApiSpec(): Promise<OpenAPIV3.Document> {
    // This OpenAPI specification describes only the necessary minimum required for OpenAI GPTs to work.
    // Not all the parameters and responses are described here.
    const openApiSchema: OpenAPIV3.Document = {
      openapi: '3.0.0',
      info: {
        title: this.pluginService.plugin.title,
        description: this.pluginService.plugin.description,
        version: await this.pluginConfigService.getSdkVersion(),
      },
      servers: [
        {
          description: 'Plugin URL',
          url: this.pluginConfigService.pluginUrl,
        },
      ],
      paths: {},
      components: {
        schemas: {},
        securitySchemes: {
          ApiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'x-api-key',
          },
        },
        responses: {
          ErrorResponse: {
            description: 'Error response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['error'],
                    },
                    error: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                        },
                      },
                      required: ['message'],
                    },
                  },
                  required: ['status', 'error'],
                },
              },
            },
          },
        },
      },
    };

    for (const action of this.pluginService.plugin.actions) {
      const path = `/api/actions/${action.key}/run`;

      const requestBody: OpenAPIV3.RequestBodyObject = {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                input: {
                  type: 'object',
                  properties: action.inputParameters.reduce(
                    (accumulator: Record<string, OpenAPIV3.SchemaObject>, inputParameter: InputParameter) => {
                      accumulator[inputParameter.key] = {
                        type: 'string',
                        title: inputParameter.title,
                        description: inputParameter.description,
                      };
                      return accumulator;
                    },
                    {},
                  ),
                  required: action.inputParameters
                    .filter((inputParameter) => inputParameter.validation?.required)
                    .map((inputParameter) => inputParameter.key),
                },
                configuration: {
                  type: 'object',
                  title: 'Configuration (optional)',
                  description: `This object contains the configuration for the plugin. 
                  If not provided, the plugin will use the default configuration set in environment variables.
                  If provided, it will override the default configuration.
                  If the default configuration values are not set, the values in the configuration object will be required.
                  In case you receive an error, please ask the user to specify the configuration to proceed.`,
                  properties: action.plugin.configurationParameters.reduce(
                    (
                      accumulator: Record<string, OpenAPIV3.SchemaObject>,
                      configurationParameter: ConfigurationParameter,
                    ) => {
                      accumulator[configurationParameter.key] = {
                        type: 'string',
                        title: configurationParameter.title,
                        description: configurationParameter.description,
                      };
                      return accumulator;
                    },
                    {},
                  ),
                },
              },
              required: ['input'],
            },
          },
        },
      };

      const responses: OpenAPIV3.ResponsesObject = {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['success'],
                  },
                  data: {
                    type: 'object',
                    properties: {
                      output: {
                        type: 'object',
                        properties: action.outputParameters.reduce(
                          (accumulator: Record<string, OpenAPIV3.SchemaObject>, outputParameter: OutputParameter) => {
                            accumulator[outputParameter.key] = {
                              type: 'string',
                              title: outputParameter.title,
                              description: outputParameter.description,
                            };
                            return accumulator;
                          },
                          {},
                        ),
                        required: action.outputParameters
                          .filter((outputParameter) => outputParameter.validation?.required)
                          .map((outputParameter) => outputParameter.key),
                      },
                    },
                    required: ['output'],
                  },
                },
                required: ['status', 'data'],
              },
            },
          },
        },
        400: { $ref: '#/components/responses/ErrorResponse' },
        401: { $ref: '#/components/responses/ErrorResponse' },
        403: { $ref: '#/components/responses/ErrorResponse' },
        404: { $ref: '#/components/responses/ErrorResponse' },
        500: { $ref: '#/components/responses/ErrorResponse' },
      };

      openApiSchema.paths[path] = {
        post: {
          operationId: action.key,
          summary: action.title,
          description: action.description,
          // For 'read' action type we set the 'x-openai-isConsequential' to false, otherwise we set it to true.
          // This mean that the 'read' actions will not require a user confirmation before running.
          // But all other action types (ceate, update delete) will require a user confirmation before running.
          //'x-openai-isConsequential': action.type !== 'read',
          'x-openai-isConsequential': false,
          requestBody,
          responses,
          security: [
            {
              ApiKey: [],
            },
          ],
        } as ExtendedOperationObject,
      };
    }

    return openApiSchema;
  }

  async getFunctionsSpec(): Promise<OpenAiFunctionSchema[]> {
    const openAiFunctions: OpenAiFunctionSchema[] = [];

    for (const action of this.pluginService.plugin.actions) {
      const openAiFunction: OpenAiFunctionSchema = {
        name: action.key,
        description: this.getDescription(action.title, action.description),
        parameters: {
          type: 'object',
          properties: {},
          required: [],
        },
      };

      for (const inputParameter of action.inputParameters) {
        openAiFunction.parameters.properties[inputParameter.key] = {
          type: 'string',
          description: this.getDescription(inputParameter.title, inputParameter.description),
        };

        if (inputParameter.validation?.required) {
          openAiFunction.parameters.required.push(inputParameter.key);
        }
      }

      openAiFunctions.push(openAiFunction);
    }

    return openAiFunctions;
  }

  private getDescription(title: string, description?: string): string {
    return description ? `${title}: ${description}` : title;
  }
}
