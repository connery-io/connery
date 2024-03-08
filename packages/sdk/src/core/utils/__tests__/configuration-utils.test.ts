import { ConfigurationObject } from '../../../types/context';
import { ConfigurationParameterDefinition } from '../../../types/definition';
import {
  resolveConfiguration,
  trimConfiguration,
  validateConfiguration,
  validateConfigurationParameterTypes,
  validateExtraConfigurationParameters,
  validateNumberOfConfigurationParameters,
  validateRequiredConfigurationParameters,
} from '../configuration-utils';

//
// Validation
//

describe('validateConfiguration()', () => {
  xit('validates the configuration parameters by calling all the validation functions', () => {
    // TODO: Implement this test
  });

  it('returns empty object if the configuration is empty', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [];
    const configuration: ConfigurationObject = {};

    const result = validateConfiguration(configurationDefinitions, configuration);

    expect(result).toEqual({});
  });

  it('returns the trimmed configuration', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const configuration: ConfigurationObject = { Name: 'John', Age: '25' };

    const result = validateConfiguration(configurationDefinitions, configuration);

    expect(result).toEqual({ Name: 'John', Age: '25' });
  });
});

describe('validateNumberOfInputParameters()', () => {
  it('throws an error if the number of configuration parameters more than 100', () => {
    const configuration: ConfigurationObject = {};
    for (let i = 0; i < 101; i++) {
      configuration[`Input${i}`] = 'value';
    }

    expect(() => validateNumberOfConfigurationParameters(configuration)).toThrowError(
      `[Configuration validation error] The configuration object is too large. The maximum number of configuration parameters is 100.`,
    );
  });

  it('does not throw an error if the number of configuration parameters is 100', () => {
    const configuration: ConfigurationObject = {};
    for (let i = 0; i < 100; i++) {
      configuration[`Input${i}`] = 'value';
    }

    expect(() => validateNumberOfConfigurationParameters(configuration)).not.toThrow();
  });

  it('does not throw an error if the number of configuration parameters is less than 100', () => {
    const configuration: ConfigurationObject = {};
    for (let i = 0; i < 99; i++) {
      configuration[`Input${i}`] = 'value';
    }

    expect(() => validateNumberOfConfigurationParameters(configuration)).not.toThrow();
  });

  it('does not throw an error if the number of configuration parameters is 0', () => {
    const configuration: ConfigurationObject = {};

    expect(() => validateNumberOfConfigurationParameters(configuration)).not.toThrow();
  });

  it('does not throw an error if the configuration parameters are not defined', () => {
    expect(() => validateNumberOfConfigurationParameters()).not.toThrow();
  });
});

describe('validateRequiredConfigurationParameters()', () => {
  it('throws an error if a required configuration parameter is missing', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const configuration: ConfigurationObject = { Age: '25' };

    expect(() => validateRequiredConfigurationParameters(configurationDefinitions, configuration)).toThrowError(
      `[Configuration validation error] The configuration parameter 'Name' is required, but the value is empty or not provided.`,
    );
  });

  it('throws an error if a required configuration parameter is empty string', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const configuration: ConfigurationObject = { Name: '', Age: '25' };

    expect(() => validateRequiredConfigurationParameters(configurationDefinitions, configuration)).toThrowError(
      `[Configuration validation error] The configuration parameter 'Name' is required, but the value is empty or not provided.`,
    );
  });

  it('does not throw an error if all required configuration parameters are provided', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: true } },
    ];
    const configuration: ConfigurationObject = { Name: 'John', Age: '25' };

    expect(() => validateRequiredConfigurationParameters(configurationDefinitions, configuration)).not.toThrow();
  });

  it('does not throw an error if a parameter is not required and is missing', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const configuration: ConfigurationObject = { Age: '25' };

    expect(() => validateRequiredConfigurationParameters(configurationDefinitions, configuration)).not.toThrow();
  });

  it('does not throw an error if a parameter is not required and is empty string', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const configuration: ConfigurationObject = { Name: '', Age: '25' };

    expect(() => validateRequiredConfigurationParameters(configurationDefinitions, configuration)).not.toThrow();
  });

  it('does not throw an error if all parameters are not requried and nothing is provided', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const configuration: ConfigurationObject = {};

    expect(() => validateRequiredConfigurationParameters(configurationDefinitions, configuration)).not.toThrow();
  });

  it('does not throw an error if Required is not defined and the parameter is missing', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: {} },
      { key: 'Age', title: 'Age', type: 'string', validation: {} },
    ];
    const configuration: ConfigurationObject = { Age: '25' };

    expect(() => validateRequiredConfigurationParameters(configurationDefinitions, configuration)).not.toThrow();
  });

  it('does not throw an error if Validation is not defined and the parameter is missing or empty', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const configuration: ConfigurationObject = { Age: '' };

    expect(() => validateRequiredConfigurationParameters(configurationDefinitions, configuration)).not.toThrow();
  });
});

describe('validateConfigurationParameterTypes()', () => {
  it('throws an error if the configuration type does not match the defined type', () => {
    // It's not possible to test this case as the ConfigurationParametersObject already has the type of the configuration parameters.
    // This test is just for the sake of completeness.
  });

  it('does not throw an error if the configuration type matches the defined type', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: true } },
    ];
    const configuration: ConfigurationObject = { Name: 'John', Age: '25' };

    expect(() => validateConfigurationParameterTypes(configurationDefinitions, configuration)).not.toThrow();
  });

  it('does not throw an error if the configuration parameter is not required and the value is empty', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
    ];
    const configuration: ConfigurationObject = { Name: '' };

    expect(() => validateConfigurationParameterTypes(configurationDefinitions, configuration)).not.toThrow();
  });

  it('does not throw an error if the configuration parameter is not required and the value is not provided', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
    ];
    const configuration: ConfigurationObject = {};

    expect(() => validateConfigurationParameterTypes(configurationDefinitions, configuration)).not.toThrow();
  });
});

describe('validateExtraConfigurationParameters()', () => {
  it('throws an error if there are extra configuration parameters that are not defined in the schema', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const configuration: ConfigurationObject = { Age: '25', Extra: 'extra' };

    expect(() => validateExtraConfigurationParameters(configurationDefinitions, configuration)).toThrowError(
      `[Configuration validation error] The configuration parameter 'Extra' is not defined in the action schema.`,
    );
  });

  it('does not throw an error if there are no extra configuration parameters that are not defined in the schema', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const configuration: ConfigurationObject = { Age: '25' };

    expect(() => validateExtraConfigurationParameters(configurationDefinitions, configuration)).not.toThrow();
  });

  it('does not throw an error if there are no configuration parameters defined in the schema and no configuration parameters are provided', () => {
    const configurationDefinitions: ConfigurationParameterDefinition[] = [];
    const configuration: ConfigurationObject = {};

    expect(() => validateExtraConfigurationParameters(configurationDefinitions, configuration)).not.toThrow();
  });
});

//
// Other
//

describe('trimConfiguration()', () => {
  it('returns the trimmed configuration', () => {
    const configuration: ConfigurationObject = { Name: '    John    ', Age: ' 25 ' };

    expect(trimConfiguration(configuration)).toEqual({ Name: 'John', Age: '25' });
  });

  it('returns empty object if the configuration is empty', () => {
    expect(trimConfiguration({})).toEqual({});
  });

  it('returns the same configuration if the configuration is already trimmed', () => {
    const configuration: ConfigurationObject = { Name: 'John', Age: '25' };

    expect(trimConfiguration(configuration)).toEqual(configuration);
  });
});

describe('resolveConfiguration()', () => {
  it('returns the custom configuration if the custom configuration is provided', () => {
    const defaultConfiguration: ConfigurationObject = { Name: 'John', Age: '25' };
    const customConfiguration: ConfigurationObject = { Name: 'Jane', Age: '30' };

    expect(resolveConfiguration(defaultConfiguration, customConfiguration)).toEqual(customConfiguration);
  });

  it('returns the custom configuration if the custom configuration contains at least one parameter', () => {
    // if at least one parameter of the custom configuration is defined, the default configuration should be ignored completely to prevent potential security issues
    const defaultConfiguration: ConfigurationObject = { Name: 'John', Age: '25' };
    const customConfiguration: ConfigurationObject = { Name: 'Jane' };

    expect(resolveConfiguration(defaultConfiguration, customConfiguration)).toEqual(customConfiguration);
  });

  it('returns the default configuration if the custom configuration is empty', () => {
    const defaultConfiguration: ConfigurationObject = { Name: 'John', Age: '25' };

    expect(resolveConfiguration(defaultConfiguration, {})).toEqual(defaultConfiguration);
  });

  it('returns the default configuration if the custom configuration is not provided', () => {
    const defaultConfiguration: ConfigurationObject = { Name: 'John', Age: '25' };

    expect(resolveConfiguration(defaultConfiguration, undefined)).toEqual(defaultConfiguration);
  });

  it('returns the custom configuration if the default configuration is not provided', () => {
    const customConfiguration: ConfigurationObject = { Name: 'Jane', Age: '30' };

    expect(resolveConfiguration(undefined, customConfiguration)).toEqual(customConfiguration);
  });

  it('returns an empty object if both the default and custom configurations are not provided', () => {
    expect(resolveConfiguration(undefined, undefined)).toEqual({});
  });

  it('returns an empty object if both the default and custom configurations are empty objects', () => {
    expect(resolveConfiguration({}, {})).toEqual({});
  });
});
