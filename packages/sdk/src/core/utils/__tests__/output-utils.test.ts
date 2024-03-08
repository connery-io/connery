import { OutputObject } from '../../../types/context';
import { OutputParameterDefinition } from '../../../types/definition';
import {
  validateRequiredOutputParameters,
  validateOutputParameterTypes,
  validateExtraOutputParameters,
  validateOutput,
  validateNumberOfOutputParameters,
  trimOutput,
} from '../output-utils';

//
// Validation
//

describe('validateOutput()', () => {
  xit('validates the output parameters by calling all validation functions', () => {
    // TODO: implement the test
  });

  it('returns empty object if the output is empty', () => {
    const outputDefinitions: OutputParameterDefinition[] = [];
    const output: OutputObject = {};

    expect(validateOutput(outputDefinitions, output)).toEqual({});
  });

  it('returns the trimmed output', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const output: OutputObject = { Name: '    John    ', Age: ' 25 ' };

    expect(validateOutput(outputDefinitions, output)).toEqual({ Name: 'John', Age: '25' });
  });
});

describe('validateNumberOfOutputParameters()', () => {
  it('throws an error if the number of output parameters more than 100', () => {
    const output: OutputObject = {};
    for (let i = 0; i < 101; i++) {
      output[`Output${i}`] = 'value';
    }

    expect(() => validateNumberOfOutputParameters(output)).toThrowError(
      `[Output validation error] The output object is too large. The maximum number of output parameters is 100.`,
    );
  });

  it('does not throw an error if the number of output parameters is 100', () => {
    const output: OutputObject = {};
    for (let i = 0; i < 100; i++) {
      output[`Output${i}`] = 'value';
    }

    expect(() => validateNumberOfOutputParameters(output)).not.toThrow();
  });

  it('does not throw an error if the number of output parameters is less than 100', () => {
    const output: OutputObject = {};
    for (let i = 0; i < 99; i++) {
      output[`Output${i}`] = 'value';
    }

    expect(() => validateNumberOfOutputParameters(output)).not.toThrow();
  });
});

describe('validateRequiredOutputParameters()', () => {
  it('throws an error if a required output parameter is missing', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const output: OutputObject = { Age: '25' };

    expect(() => validateRequiredOutputParameters(outputDefinitions, output)).toThrowError(
      `[Output validation error] The action has been run. However, the output is not valid. The output parameter 'Name' is required, but the value is empty or not provided.`,
    );
  });

  it('throws an error if a required output parameter is empty string', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const output: OutputObject = { Name: '', Age: '25' };

    expect(() => validateRequiredOutputParameters(outputDefinitions, output)).toThrowError(
      `[Output validation error] The action has been run. However, the output is not valid. The output parameter 'Name' is required, but the value is empty or not provided.`,
    );
  });

  it('does not throw an error if all required output parameters are provided', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: true } },
    ];
    const output: OutputObject = { Name: 'John', Age: '25' };

    expect(() => validateRequiredOutputParameters(outputDefinitions, output)).not.toThrow();
  });

  it('does not throw an error if a parameter is not required and is missing', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const output: OutputObject = { Age: '25' };

    expect(() => validateRequiredOutputParameters(outputDefinitions, output)).not.toThrow();
  });

  it('does not throw an error if a parameter is not required and is empty string', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const output: OutputObject = { Name: '', Age: '25' };

    expect(() => validateRequiredOutputParameters(outputDefinitions, output)).not.toThrow();
  });

  it('does not throw an error if all parameters are not requried and nothing is provided', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: false } },
    ];
    const output: OutputObject = {};

    expect(() => validateRequiredOutputParameters(outputDefinitions, output)).not.toThrow();
  });

  it('does not throw an error if Required is not defined and the parameter is missing', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: {} },
      { key: 'Age', title: 'Age', type: 'string', validation: {} },
    ];
    const output: OutputObject = { Age: '25' };

    expect(() => validateRequiredOutputParameters(outputDefinitions, output)).not.toThrow();
  });

  it('does not throw an error if Validation is not defined and the parameter is missing or empty', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const output: OutputObject = { Age: '' };

    expect(() => validateRequiredOutputParameters(outputDefinitions, output)).not.toThrow();
  });
});

describe('validateOutputParameterTypes()', () => {
  it('throws an error if the output type does not match the defined type', () => {
    // It's not possible to test this case as the OutputParametersObject already has the type of the output parameters.
    // This test is just for the sake of completeness.
  });

  it('does not throw an error if the output type matches the defined type', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: true } },
      { key: 'Age', title: 'Age', type: 'string', validation: { required: true } },
    ];
    const output: OutputObject = { Name: 'John', Age: '25' };

    expect(() => validateOutputParameterTypes(outputDefinitions, output)).not.toThrow();
  });

  it('does not throw an error if the output parameter is not required and the value is empty', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
    ];
    const output: OutputObject = { Name: '' };

    expect(() => validateOutputParameterTypes(outputDefinitions, output)).not.toThrow();
  });

  it('does not throw an error if the output parameter is not required and the value is not provided', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string', validation: { required: false } },
    ];
    const output: OutputObject = {};

    expect(() => validateOutputParameterTypes(outputDefinitions, output)).not.toThrow();
  });
});

describe('validateExtraOutputParameters()', () => {
  it('throws an error if there are extra output parameters that are not defined in the schema', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const output: OutputObject = { Age: '25', Extra: 'extra' };

    expect(() => validateExtraOutputParameters(outputDefinitions, output)).toThrowError(
      `[Output validation error] The action has been run. However, the output is not valid. The output parameter 'Extra' is not defined in the action schema.`,
    );
  });

  it('does not throw an error if there are no extra output parameters that are not defined in the schema', () => {
    const outputDefinitions: OutputParameterDefinition[] = [
      { key: 'Name', title: 'Name', type: 'string' },
      { key: 'Age', title: 'Age', type: 'string' },
    ];
    const output: OutputObject = { Age: '25' };

    expect(() => validateExtraOutputParameters(outputDefinitions, output)).not.toThrow();
  });

  it('does not throw an error if there are no output parameters defined in the schema and no output parameters are provided', () => {
    const outputDefinitions: OutputParameterDefinition[] = [];
    const output: OutputObject = {};

    expect(() => validateExtraOutputParameters(outputDefinitions, output)).not.toThrow();
  });
});

//
// Other
//

describe('trimOutput()', () => {
  it('returns the trimmed output', () => {
    const output: OutputObject = { Name: '    John    ', Age: ' 25 ' };

    expect(trimOutput(output)).toEqual({ Name: 'John', Age: '25' });
  });

  it('returns empty object if the output is empty', () => {
    const output: OutputObject = {};

    expect(trimOutput(output)).toEqual({});
  });

  it('returns the same object if the output is already trimmed', () => {
    const output: OutputObject = { Name: 'John', Age: '25' };

    expect(trimOutput(output)).toEqual(output);
  });
});
