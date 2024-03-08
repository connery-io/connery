import { RunActionResponse } from '../api/dto.js';
import { ConfigurationObject, InputObject } from './context.js';
import {
  ConfigurationParameterDefinition,
  InputParameterDefinition,
  MaintainerDefinition,
  OperationDefinition,
  OutputParameterDefinition,
} from './definition.js';

export interface PluginRuntime {
  title: string;
  description?: string;
  actions: ActionRuntime[];
  configurationParameters: ConfigurationParameterDefinition[];
  maintainers: MaintainerDefinition[];

  findActionByKey(key: string): ActionRuntime | undefined;
}

export interface ActionRuntime {
  key: string;
  title: string;
  description?: string;
  type: 'create' | 'read' | 'update' | 'delete';
  inputParameters: InputParameterDefinition[];
  outputParameters: OutputParameterDefinition[];
  operation: OperationDefinition;
  plugin: PluginRuntime;

  run(
    input: InputObject,
    defaultConfiguration: ConfigurationObject | undefined,
    customConfiguration: ConfigurationObject | undefined,
  ): Promise<RunActionResponse>;
}
