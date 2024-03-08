import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActionRuntime, PluginRuntime } from '../types/runtime';
import {
  ConfigurationParameterDefinition,
  InputParameterDefinition,
  MaintainerDefinition,
  OutputParameterDefinition,
  ValidationDefinition,
} from '../types/definition';
import { ConfigurationObject, InputObject, OutputObject } from '../types/context';

//
// Generic response types
//

export class GenericPaginatedResponse<T> {
  @ApiProperty({
    enum: ['success'],
  })
  status: 'success';

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
    },
  })
  data: T[];

  constructor(data: T[]) {
    this.status = 'success';
    this.data = data;
  }
}

export class GenericObjectResponse<T> {
  @ApiProperty({
    enum: ['success'],
  })
  status: 'success';

  @ApiProperty({
    type: 'object',
  })
  data: T;

  constructor(data: T) {
    this.status = 'success';
    this.data = data;
  }
}

export class Error {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class GenericErrorResponse {
  @ApiProperty({
    enum: ['error'],
  })
  status: 'error';

  @ApiProperty({
    type: Error,
  })
  error: Error;

  constructor(message: string) {
    this.status = 'error';
    this.error = {
      message,
    };
  }
}

//
// Response types
//

export class Maintainer {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  constructor(maintainer: MaintainerDefinition) {
    this.name = maintainer.name;
    this.email = maintainer.email;
  }
}

export class Validation {
  @ApiPropertyOptional()
  required?: boolean;

  constructor(validation?: ValidationDefinition) {
    this.required = validation?.required;
  }
}

export class ConfigurationParameter {
  @ApiProperty()
  key: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({
    enum: ['string'],
  })
  type: 'string';

  @ApiPropertyOptional({
    type: Validation,
  })
  validation?: Validation;

  constructor(configurationParameter: ConfigurationParameterDefinition) {
    this.key = configurationParameter.key;
    this.title = configurationParameter.title;
    this.description = configurationParameter.description;
    this.type = configurationParameter.type;
    this.validation = new Validation(configurationParameter.validation);
  }
}

export class Plugin {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({
    type: ConfigurationParameter,
    isArray: true,
    title: 'Metadata of the plugin configuration parameters.',
    description:
      'The configuration parameters are used to configure the plugin and its actions. For example, the API keys, the URLs, credentials, etc., can be configured here to be used in the actions. Configuration parameters can be set in the environment variables of the plugin. But also, they can be set when running an action. The configuration parameters set when running an action will override the configuration parameters set in the environment variables.',
  })
  configurationParameters: ConfigurationParameter[];

  @ApiProperty({
    type: Maintainer,
    isArray: true,
    title: 'The maintainers of the plugin.',
  })
  maintainers: Maintainer[];

  constructor(plugin: PluginRuntime) {
    this.title = plugin.title;
    this.description = plugin.description;
    this.configurationParameters = plugin.configurationParameters.map(
      (configurationParameter) => new ConfigurationParameter(configurationParameter),
    );
    this.maintainers = plugin.maintainers.map((maintainer) => new Maintainer(maintainer));
  }
}

export class InputParameter {
  @ApiProperty()
  key: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({
    enum: ['string'],
  })
  type: 'string';

  @ApiPropertyOptional({
    type: Validation,
  })
  validation?: Validation;

  constructor(inputParameter: InputParameterDefinition) {
    this.key = inputParameter.key;
    this.title = inputParameter.title;
    this.description = inputParameter.description;
    this.type = inputParameter.type;
    this.validation = new Validation(inputParameter.validation);
  }
}

export class OutputParameter {
  @ApiProperty()
  key: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({
    enum: ['string'],
  })
  type: 'string';

  @ApiPropertyOptional({
    type: Validation,
  })
  validation?: Validation;

  constructor(outputParameter: OutputParameterDefinition) {
    this.key = outputParameter.key;
    this.title = outputParameter.title;
    this.description = outputParameter.description;
    this.type = outputParameter.type;
    this.validation = new Validation(outputParameter.validation);
  }
}

export class Action {
  @ApiProperty()
  key: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({
    enum: ['create', 'read', 'update', 'delete'],
  })
  type: 'create' | 'read' | 'update' | 'delete';

  @ApiProperty({
    type: InputParameter,
    isArray: true,
    title: 'Metadata of the action input parameters.',
  })
  inputParameters: InputParameter[];

  @ApiProperty({
    type: OutputParameter,
    isArray: true,
    title: 'Metadata of the action output parameters.',
  })
  outputParameters: OutputParameter[];

  constructor(action: ActionRuntime) {
    this.key = action.key;
    this.title = action.title;
    this.description = action.description;
    this.type = action.type;
    this.inputParameters = action.inputParameters.map((inputParameter) => new InputParameter(inputParameter));
    this.outputParameters = action.outputParameters.map((outputParameter) => new OutputParameter(outputParameter));
  }
}

export class RunActionResponse {
  @ApiProperty({
    type: 'object',
    title: 'The output of the action run.',
    description: 'You can find the output parameters metadata in the action.',
    example: {
      outputParameterKey1: 'value1',
      outputParameterKey2: 'value2',
    },
  })
  output: {
    [key: string]: any;
  };

  constructor(output: OutputObject) {
    this.output = output;
  }
}

//
// Request types
//

export class RunActionRequest {
  @ApiProperty({
    type: 'object',
    title: 'The input for the action.',
    description: 'You can find the input parameters metadata in the action.',
    example: {
      inputParameterKey1: 'value1',
      inputParameterKey2: 'value2',
    },
  })
  input: {
    [key: string]: any;
  };

  @ApiPropertyOptional({
    type: 'object',
    title: 'The configuration for the action.',
    description:
      'You can find the configuration parameters metadata in the plugin. If not provided, the default plugin configuration will be used from the environment variables.',
    example: {
      configurationParameterKey1: 'value1',
      configurationParameterKey2: 'value2',
    },
  })
  configuration?: {
    [key: string]: any;
  };

  constructor(input: InputObject, configuration?: ConfigurationObject) {
    this.input = input;
    this.configuration = configuration;
  }
}
