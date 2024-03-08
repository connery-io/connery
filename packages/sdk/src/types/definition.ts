import { ActionContext, OutputObject } from './context.js';

export interface PluginDefinition {
  title: string;
  description?: string;
  actions: ActionDefinition[];
  configurationParameters: ConfigurationParameterDefinition[];
  maintainers: MaintainerDefinition[];
}

export interface ActionDefinition {
  key: string;
  title: string;
  description?: string;
  type: 'create' | 'read' | 'update' | 'delete';
  inputParameters: InputParameterDefinition[];
  outputParameters: OutputParameterDefinition[];
  operation: OperationDefinition;
}

export interface InputParameterDefinition {
  key: string;
  title: string;
  description?: string;
  type: 'string';
  validation?: ValidationDefinition;
}

export interface OutputParameterDefinition {
  key: string;
  title: string;
  description?: string;
  type: 'string';
  validation?: ValidationDefinition;
}

export interface OperationDefinition {
  handler: (context: ActionContext) => Promise<OutputObject>;
}

export interface ConfigurationParameterDefinition {
  key: string;
  title: string;
  description?: string;
  type: 'string';
  validation?: ValidationDefinition;
}

export interface MaintainerDefinition {
  name: string;
  email: string;
}

export interface ValidationDefinition {
  required?: boolean;
}
