import { InputParameterDefinition, InputObject } from '../../sdk';

//
// Validation
//

// TODO: test: if empty object in, empty object out
export function validateInput(inputDefinitions: InputParameterDefinition[], input: InputObject): InputObject {
  validateNumberOfInputParameters(input);
  const trimmedInput = trimInput(input);
  validateRequiredInputParameters(inputDefinitions, trimmedInput);
  validateInputParameterTypes(inputDefinitions, trimmedInput);
  validateExtraInputParameters(inputDefinitions, trimmedInput);
  return trimmedInput;
}

export function validateNumberOfInputParameters(input?: InputObject): void {
  // This validation also prevents DoS attacks by limiting the length of the input parameters object:
  // (https://github.com/connery-io/connery/security/code-scanning/1)
  if (Object.keys(input || {}).length > 100) {
    throw new Error(
      '[Input validation error] The input object is too large. The maximum number of input parameters is 100.',
    );
  }
}

// Validate if all required input parameters are present
export function validateRequiredInputParameters(
  inputDefinitions: InputParameterDefinition[],
  input: InputObject,
): void {
  inputDefinitions.forEach((inputDefinition) => {
    if (inputDefinition.validation?.required && !input[inputDefinition.key]) {
      throw new Error(
        `[Input validation error] Input parameter '${inputDefinition.key}' is required, but the value is empty or not provided.`,
      );
    }
  });
}

// Validate if the type of the input parameters are correct
export function validateInputParameterTypes(inputDefinitions: InputParameterDefinition[], input: InputObject): void {
  inputDefinitions.forEach((inputDefinition) => {
    if (inputDefinition.type !== typeof input[inputDefinition.key]) {
      // Ignore the validation if the input parameter is not required and the value is empty or not provided
      if (!inputDefinition.validation?.required && typeof input[inputDefinition.key] === 'undefined') {
        return;
      } else {
        throw new Error(
          `[Input validation error] The input parameter '${
            inputDefinition.key
          }' has incorrect type. The expected type is '${
            inputDefinition.type
          }', but the actual value has the type '${typeof input[inputDefinition.key]}'.`,
        );
      }
    }
  });
}

// Validate if there are no extra input parameters that are not defined in the schema
export function validateExtraInputParameters(inputDefinitions: InputParameterDefinition[], input: InputObject): void {
  Object.keys(input).forEach((inputKey) => {
    if (!inputDefinitions.find((inputDefinition) => inputDefinition.key === inputKey)) {
      throw new Error(`[Input validation error] Input parameter '${inputKey}' is not defined in the action schema.`);
    }
  });
}

//
// Other
//

// TODO: test
export function trimInput(input?: InputObject): InputObject {
  const trimmedInput: InputObject = {};

  if (!input) {
    return trimmedInput;
  }

  Object.keys(input).forEach((key) => {
    trimmedInput[key] = input[key].trim();
  });

  return trimmedInput;
}
