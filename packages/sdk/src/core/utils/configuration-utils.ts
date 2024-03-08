import { ConfigurationObject, ConfigurationParameterDefinition } from '../../sdk';

//
// Validation
//

export function validateConfiguration(
  configurationDefinitions: ConfigurationParameterDefinition[],
  configuration: ConfigurationObject,
): ConfigurationObject {
  validateNumberOfConfigurationParameters(configuration);
  const trimmedConfiguration = trimConfiguration(configuration);
  validateRequiredConfigurationParameters(configurationDefinitions, configuration);
  validateConfigurationParameterTypes(configurationDefinitions, configuration);
  validateExtraConfigurationParameters(configurationDefinitions, configuration);
  return trimmedConfiguration;
}

export function validateNumberOfConfigurationParameters(configuration?: ConfigurationObject): void {
  // This validation also prevents DoS attacks by limiting the length of the input parameters object:
  // (https://github.com/connery-io/connery/security/code-scanning/1)
  if (Object.keys(configuration || {}).length > 100) {
    throw new Error(
      '[Configuration validation error] The configuration object is too large. The maximum number of configuration parameters is 100.',
    );
  }
}

export function validateRequiredConfigurationParameters(
  configurationParametersDefinitions: ConfigurationParameterDefinition[],
  configurationParameters: ConfigurationObject,
): void {
  configurationParametersDefinitions.forEach((configurationParameterDefinition) => {
    if (
      configurationParameterDefinition.validation?.required &&
      !configurationParameters[configurationParameterDefinition.key]
    ) {
      throw new Error(
        `[Configuration validation error] The configuration parameter '${configurationParameterDefinition.key}' is required, but the value is empty or not provided.`,
      );
    }
  });
}

export function validateConfigurationParameterTypes(
  configurationParametersDefinitions: ConfigurationParameterDefinition[],
  configurationParameters: ConfigurationObject,
): void {
  configurationParametersDefinitions.forEach((configurationParameterDefinition) => {
    if (
      configurationParameterDefinition.type !== typeof configurationParameters[configurationParameterDefinition.key]
    ) {
      if (
        !configurationParameterDefinition.validation?.required &&
        typeof configurationParameters[configurationParameterDefinition.key] === 'undefined'
      ) {
        return;
      } else {
        throw new Error(
          `[Configuration validation error] The configuration parameter '${
            configurationParameterDefinition.key
          }' has incorrect type. The expected type is '${
            configurationParameterDefinition.type
          }', but the actual value has the type '${typeof configurationParameters[
            configurationParameterDefinition.key
          ]}'.`,
        );
      }
    }
  });
}

export function validateExtraConfigurationParameters(
  configurationParametersDefinitions: ConfigurationParameterDefinition[],
  configurationParameters: ConfigurationObject,
): void {
  Object.keys(configurationParameters).forEach((configurationParameterKey) => {
    if (
      !configurationParametersDefinitions.find(
        (configurationParameterDefinition) => configurationParameterDefinition.key === configurationParameterKey,
      )
    ) {
      throw new Error(
        `[Configuration validation error] The configuration parameter '${configurationParameterKey}' is not defined in the action schema.`,
      );
    }
  });
}

//
// Other
//

export function trimConfiguration(configuration: ConfigurationObject): ConfigurationObject {
  const trimmedConfiguration: ConfigurationObject = {};

  if (!configuration) {
    return trimmedConfiguration;
  }

  Object.keys(configuration).forEach((key) => {
    trimmedConfiguration[key] = configuration[key].trim();
  });

  return trimmedConfiguration;
}

export function resolveConfiguration(
  defaultConfiguration: ConfigurationObject | undefined,
  customConfiguration: ConfigurationObject | undefined,
): ConfigurationObject {
  // If customConfiguration is not provided (undefined), return defaultConfiguration if it exists, or an empty object
  if (customConfiguration === undefined) {
    return defaultConfiguration ?? {};
  }

  // If customConfiguration is provided and not an empty object, return customConfiguration
  if (Object.keys(customConfiguration).length > 0) {
    return customConfiguration;
  }

  // If customConfiguration is an empty object, return defaultConfiguration if it exists, or an empty object
  return defaultConfiguration ?? {};
}
