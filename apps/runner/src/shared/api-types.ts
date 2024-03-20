import { ActionDefinition, InputParametersObject } from '@connery-io/sdk';
import { ActionRuntime, PluginRuntime } from 'lib';
import { ApiProperty } from '@nestjs/swagger';

//
// API generic response types
//

export type PaginatedResponse<T> = {
  status: 'success';
  data: T[];
};

export type ObjectResponse<T> = {
  status: 'success';
  data: T;
};

export type ErrorResponse = {
  status: 'error';
  error: {
    message: string;
  };
};

//
// API response types
//

export type PluginListResponseType = {
  id: string;
  key: string;
  title: string;
  description?: string;
};

export type PluginResponseType = PluginListResponseType & {
  actions: ActionResponseType[];
};

export type ActionResponseType = Omit<ActionDefinition, 'operation'> & {
  id: string;
  pluginId: string;
};

//
// API response type converters
//

// Convert an array of PluginRuntime to an array of PluginListResponseType
export function convertPluginForList(plugin: PluginRuntime): PluginListResponseType {
  return {
    id: plugin.id,
    key: plugin.key,
    title: plugin.definition.title,
    description: plugin.definition.description,
  };
}

// Convert an PluginRuntime to an PluginResponseType
export function convertPlugin(plugin: PluginRuntime): PluginResponseType {
  return {
    id: plugin.id,
    key: plugin.key,
    title: plugin.definition.title,
    description: plugin.definition.description,
    actions: plugin.actions.map(convertAction),
  };
}

// Convert an ActionRuntime to an ActionResponseType
export function convertAction(action: ActionRuntime): ActionResponseType {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { operation, ...rest } = action.definition;
  return {
    id: action.id,
    ...rest,
    pluginId: action.plugin.id,
  };
}

//
// DTOs
//

export class IdentifyActionRequest {
  @ApiProperty({ example: 'Clean a plugin cache on the runner' })
  prompt!: string;
}

export class RunActionRequest {
  @ApiProperty()
  prompt?: string;

  @ApiProperty()
  input?: InputParametersObject;
}
