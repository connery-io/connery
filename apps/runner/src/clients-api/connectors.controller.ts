import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ActionOutput,
  ConnectorOutput,
  ObjectResponse,
  PaginatedResponse,
  RunActionInput,
  RunActionOutput,
} from './types';
import { ConnectorsService } from ':src/shared/connectors.service';
import { map } from 'lodash';

@Controller('/v1/connectors')
export class ConnectorsController {
  constructor(private connectorsService: ConnectorsService) {}

  @Get('/')
  async getConnectors(): Promise<PaginatedResponse<ConnectorOutput[]>> {
    try {
      const connectors = await this.connectorsService.getConnectors();

      return {
        status: 'success',
        data: map(connectors, (connector) => {
          return {
            key: connector.key,
            title: connector.schema.title,
            description: connector.schema.description,
            actions: map(connector.getActions(), (action) => {
              return {
                key: action.key,
                title: action.schema.title,
                description: action.schema.description,
                type: action.schema.type,
                inputParameters: action.schema.inputParameters,
                outputParameters: action.schema.outputParameters,
              };
            }),
          };
        }),
      };
    } catch (error: any) {
      return {
        status: 'error',
        error: {
          message: error.message,
        },
      };
    }
  }

  @Get('/:connectorKeyPart1/:connectorKeyPart2')
  async getConnector(
    @Param('connectorKeyPart1') connectorKeyPart1: string,
    @Param('connectorKeyPart2') connectorKeyPart2: string,
  ): Promise<ObjectResponse<ConnectorOutput>> {
    try {
      const connector = await this.connectorsService.getConnector(`${connectorKeyPart1}/${connectorKeyPart2}`);

      return {
        status: 'success',
        data: {
          key: connector.key,
          title: connector.schema.title,
          description: connector.schema.description,
          actions: map(connector.getActions(), (action) => {
            return {
              key: action.key,
              title: action.schema.title,
              description: action.schema.description,
              type: action.schema.type,
              inputParameters: action.schema.inputParameters,
              outputParameters: action.schema.outputParameters,
            };
          }),
        },
      };
    } catch (error: any) {
      return {
        status: 'error',
        error: {
          message: error.message,
        },
      };
    }
  }

  @Get('/:connectorKeyPart1/:connectorKeyPart2/actions/:actionKey')
  async getAction(
    @Param('connectorKeyPart1') connectorKeyPart1: string,
    @Param('connectorKeyPart2') connectorKeyPart2: string,
    @Param('actionKey') actionKey: string,
  ): Promise<ObjectResponse<ActionOutput>> {
    try {
      const connector = await this.connectorsService.getConnector(`${connectorKeyPart1}/${connectorKeyPart2}`);
      const action = connector.getAction(actionKey);

      return {
        status: 'success',
        data: {
          key: action.key,
          title: action.schema.title,
          description: action.schema.description,
          type: action.schema.type,
          inputParameters: action.schema.inputParameters,
          outputParameters: action.schema.outputParameters,
        },
      };
    } catch (error: any) {
      return {
        status: 'error',
        error: {
          message: error.message,
        },
      };
    }
  }

  @Post('/:connectorKeyPart1/:connectorKeyPart2/actions/:actionKey/run')
  async runAction(
    @Param('connectorKeyPart1') connectorKeyPart1: string,
    @Param('connectorKeyPart2') connectorKeyPart2: string,
    @Param('actionKey') actionKey: string,
    @Body() body: RunActionInput,
  ): Promise<ObjectResponse<RunActionOutput>> {
    try {
      const connector = await this.connectorsService.getConnector(`${connectorKeyPart1}/${connectorKeyPart2}`);
      const action = connector.getAction(actionKey);
      const result = await action.runAction(body);

      return {
        status: 'success',
        data: {
          output: result,
          used: {
            connectorKey: connector.key,
            actionKey: action.key,
            inputParameters: body,
          },
        },
      };
    } catch (error: any) {
      return {
        status: 'error',
        error: {
          message: error.message,
        },
      };
    }
  }
}