export default `import { ActionDefinition, ActionContext, OutputParametersObject } from '@connery-io/sdk';

const action: ActionDefinition = {
  key: '{{key}}',
  title: '{{title}}',
  description: '{{description}}',
  type: '{{type}}',
  inputParameters: [],
  operation: {
    handler: handler,
  },
  outputParameters: [],
};
export default action;

export async function handler({
  inputParameters,
  configurationParameters,
}: ActionContext): Promise<OutputParametersObject> {
  // TODO: Implement the action logic.

  return {};
}
`;
