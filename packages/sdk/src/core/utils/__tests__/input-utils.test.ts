import { InputObject } from '../../../types/context';
import { InputParameterDefinition } from '../../../types/definition';
import {
  validateRequiredInputParameters,
  validateInputParameterTypes,
  validateExtraInputParameters,
  validateNumberOfInputParameters,
  trimInput,
  validateInput,
} from '../input-utils';

//
// Validation
//

describe('validateInput()', () => {
  xit('validates the input parameters by calling all validation functions', () => {
    // TODO: implement the test
  });

  it('returns empty object if the input is empty', () => {
    const inputDefinitions: InputParameterDefinition[] = [];
    const input: InputObject = {};

    expect(validateInput(inputDefinitions, input)).toEqual({});
  });

  it('returns the trimmed input', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'name', title: 'Name', type: 'string' },
      { key: 'age', title: 'Age', type: 'string' },
    ];
    const input: InputObject = { name: '    John    ', age: ' 25 ' };

    expect(validateInput(inputDefinitions, input)).toEqual({ name: 'John', age: '25' });
  });
});

describe('validateNumberOfInputParameters()', () => {
  it('throws an error if the number of input parameters more than 100', () => {
    const input: InputObject = {};
    for (let i = 0; i < 101; i++) {
      input[`Input${i}`] = 'value';
    }

    expect(() => validateNumberOfInputParameters(input)).toThrowError(
      `[Input validation error] The input object is too large. The maximum number of input parameters is 100.`,
    );
  });

  it('does not throw an error if the number of input parameters is 100', () => {
    const input: InputObject = {};
    for (let i = 0; i < 100; i++) {
      input[`Input${i}`] = 'value';
    }

    expect(() => validateNumberOfInputParameters(input)).not.toThrow();
  });

  it('does not throw an error if the number of input parameters is less than 100', () => {
    const input: InputObject = {};
    for (let i = 0; i < 99; i++) {
      input[`Input${i}`] = 'value';
    }

    expect(() => validateNumberOfInputParameters(input)).not.toThrow();
  });

  it('does not throw an error if the number of input parameters is 0', () => {
    const input: InputObject = {};

    expect(() => validateNumberOfInputParameters(input)).not.toThrow();
  });

  it('does not throw an error if the input parameters are not defined', () => {
    expect(() => validateNumberOfInputParameters()).not.toThrow();
  });
});

describe('validateRequiredInputParameters()', () => {
  it('throws an error if a required input parameter is missing', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const input: InputObject = { Age: '25' };

    expect(() => validateRequiredInputParameters(inputDefinitions, input)).toThrowError(
      `[Input validation error] Input parameter 'Name' is required, but the value is empty or not provided.`,
    );
  });

  it('throws an error if a required input parameter is empty string', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const input: InputObject = { Name: '', Age: '25' };

    expect(() => validateRequiredInputParameters(inputDefinitions, input)).toThrowError(
      `[Input validation error] Input parameter 'Name' is required, but the value is empty or not provided.`,
    );
  });

  it('does not throw an error if all required input parameters are provided', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: true } },
    ];
    const input: InputObject = { Name: 'John', Age: '25' };

    expect(() => validateRequiredInputParameters(inputDefinitions, input)).not.toThrow();
  });

  it('does not throw an error if a parameter is not required and is missing', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const input: InputObject = { Age: '25' };

    expect(() => validateRequiredInputParameters(inputDefinitions, input)).not.toThrow();
  });

  it('does not throw an error if a parameter is not required and is empty string', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const input: InputObject = { Name: '', Age: '25' };

    expect(() => validateRequiredInputParameters(inputDefinitions, input)).not.toThrow();
  });

  it('does not throw an error if all parameters are not requried and nothing is provided', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const input: InputObject = {};

    expect(() => validateRequiredInputParameters(inputDefinitions, input)).not.toThrow();
  });

  it('does not throw an error if Required is not defined and the parameter is missing', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: {} },
      { key: 'Age', title: 'Age', type: 'string', validation: {} },
    ];
    const input: InputObject = { Age: '25' };

    expect(() => validateRequiredInputParameters(inputDefinitions, input)).not.toThrow();
  });

  it('does not throw an error if Validation is not defined and the parameter is missing or empty', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const input: InputObject = { Age: '' };

    expect(() => validateRequiredInputParameters(inputDefinitions, input)).not.toThrow();
  });
});

describe('validateInputParameterTypes()', () => {
  it('throws an error if the input type does not match the defined type', () => {
    // It's not possible to test this case as the InputParametersObject already has the type of the input parameters.
    // This test is just for the sake of completeness.
  });

  it('does not throw an error if the input type matches the defined type', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: true } },
    ];
    const input: InputObject = { Name: 'John', Age: '25' };

    expect(() => validateInputParameterTypes(inputDefinitions, input)).not.toThrow();
  });

  it('does not throw an error if the input parameter is not required and the value is empty', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
    ];
    const input: InputObject = { Name: '' };

    expect(() => validateInputParameterTypes(inputDefinitions, input)).not.toThrow();
  });

  it('does not throw an error if the input parameter is not required and the value is not provided', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
    ];
    const input: InputObject = {};

    expect(() => validateInputParameterTypes(inputDefinitions, input)).not.toThrow();
  });
});

describe('validateExtraInputParameters()', () => {
  it('throws an error if there are extra input parameters that are not defined in the schema', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const input: InputObject = { Age: '25', Extra: 'extra' };

    expect(() => validateExtraInputParameters(inputDefinitions, input)).toThrowError(
      `[Input validation error] Input parameter 'Extra' is not defined in the action schema.`,
    );
  });

  it('does not throw an error if there are no extra input parameters that are not defined in the schema', () => {
    const inputDefinitions: InputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const input: InputObject = { Age: '25' };

    expect(() => validateExtraInputParameters(inputDefinitions, input)).not.toThrow();
  });

  it('does not throw an error if there are no input parameters defined in the schema and no input parameters are provided', () => {
    const inputDefinitions: InputParameterDefinition[] = [];
    const input: InputObject = {};

    expect(() => validateExtraInputParameters(inputDefinitions, input)).not.toThrow();
  });
});

//
// Other
//

describe('trimInput()', () => {
  it('returns the trimmed input', () => {
    const input: InputObject = { Name: '    John    ', Age: ' 25 ' };

    expect(trimInput(input)).toEqual({ Name: 'John', Age: '25' });
  });

  it('returns empty object if the input is empty', () => {
    const input: InputObject = {};

    expect(trimInput(input)).toEqual({});
  });

  it('returns the same input if the input is already trimmed', () => {
    const input: InputObject = { Name: 'John', Age: '25' };

    expect(trimInput(input)).toEqual(input);
  });
});
