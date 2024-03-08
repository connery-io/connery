export default `import { handler } from '../../src/actions/sampleAction';

it('should add 1 and 2 and return 3', async () => {
  const configurationParameters = {};
  const inputParameters = {
    number1: '1',
    number2: '2',
  };

  const result = await handler({ inputParameters, configurationParameters });

  expect(result).toEqual({
    sum: '3',
  });
});

it('should add 0 and 0 and return 0', async () => {
  const configurationParameters = {};
  const inputParameters = {
    number1: '0',
    number2: '0',
  };

  const result = await handler({ inputParameters, configurationParameters });

  expect(result).toEqual({
    sum: '0',
  });
});

it('should add 1 and -1 and return 0', async () => {
  const configurationParameters = {};
  const inputParameters = {
    number1: '1',
    number2: '-1',
  };

  const result = await handler({ inputParameters, configurationParameters });

  expect(result).toEqual({
    sum: '0',
  });
});

it('should add 50.1 and 49.9 and return 100', async () => {
  const configurationParameters = {};
  const inputParameters = {
    number1: '50.1',
    number2: '49.9',
  };

  const result = await handler({ inputParameters, configurationParameters });

  expect(result).toEqual({
    sum: '100',
  });
});
`;
