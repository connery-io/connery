import { OutputObject } from '../../types/context';
import { OutputParameterDefinition } from '../../types/definition';

//
// Validation
//

export function validateOutput(outputDefinitions: OutputParameterDefinition[], output: OutputObject): OutputObject {
  validateNumberOfOutputParameters(output);
  const trimmedOutput = trimOutput(output);
  validateRequiredOutputParameters(outputDefinitions, output);
  validateOutputParameterTypes(outputDefinitions, output);
  validateExtraOutputParameters(outputDefinitions, output);
  return trimmedOutput;
}

export function validateNumberOfOutputParameters(output?: OutputObject): void {
  // This validation also prevents DoS attacks by limiting the length of the input parameters object:
  // (https://github.com/connery-io/connery/security/code-scanning/1)
  if (Object.keys(output || {}).length > 100) {
    throw new Error(
      '[Output validation error] The output object is too large. The maximum number of output parameters is 100.',
    );
  }
}

export function validateRequiredOutputParameters(
  outputDefinitions: OutputParameterDefinition[],
  output: OutputObject,
): void {
  outputDefinitions.forEach((outputDefinition) => {
    if (outputDefinition.validation?.required && !output[outputDefinition.key]) {
      throw new Error(
        `[Output validation error] The action has been run. However, the output is not valid. The output parameter '${outputDefinition.key}' is required, but the value is empty or not provided.`,
      );
    }
  });
}

export function validateOutputParameterTypes(
  outputDefinitions: OutputParameterDefinition[],
  output: OutputObject,
): void {
  outputDefinitions.forEach((outputDefinition) => {
    if (outputDefinition.type !== typeof output[outputDefinition.key]) {
      // Ignore the validation if the input parameter is not required and the value is empty or not provided
      if (!outputDefinition.validation?.required && typeof output[outputDefinition.key] === 'undefined') {
        return;
      } else {
        throw new Error(
          `[Output validation error] The action has been run. However, the output is not valid. The output parameter '${
            outputDefinition.key
          }' has an incorrect type. The expected type is '${
            outputDefinition.type
          }', but the actual value has the type '${typeof output[outputDefinition.key]}'.`,
        );
      }
    }
  });
}

export function validateExtraOutputParameters(
  outputDefinitions: OutputParameterDefinition[],
  output: OutputObject,
): void {
  Object.keys(output).forEach((outputKey) => {
    if (!outputDefinitions.find((outputDefinition) => outputDefinition.key === outputKey)) {
      throw new Error(
        `[Output validation error] The action has been run. However, the output is not valid. The output parameter '${outputKey}' is not defined in the action schema.`,
      );
    }
  });
}

//
// Other
//

export function trimOutput(output: OutputObject): OutputObject {
  const trimmedOutput: OutputObject = {};

  if (!output) {
    return trimmedOutput;
  }

  Object.keys(output).forEach((key) => {
    trimmedOutput[key] = output[key].trim();
  });

  return trimmedOutput;
}
