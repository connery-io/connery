export default `import { PluginDefinition } from '@connery-io/sdk';
import sampleAction from './actions/sampleAction';

const plugin: PluginDefinition = {
  title: '{{plugin.title}}',
  description: '{{plugin.description}}',
  actions: [sampleAction],
  configurationParameters: [],
  maintainers: [
    {
      name: '{{maintainer.name}}',
      email: '{{maintainer.email}}',
    },
  ],
  connery: {
    runnerVersion: '0',
  },
};
export default plugin;
`;
