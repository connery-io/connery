import { ConfigurationParameterDefinition, MaintainerDefinition, PluginDefinition } from '../types/definition.js';
import { ActionRuntime, PluginRuntime } from '../types/runtime.js';
import { Action } from './action.js';
import { validatePluginDefinition } from './utils/plugin-definition-validation-utils.js';

export class Plugin implements PluginRuntime {
  title: string;
  description?: string | undefined;
  actions: ActionRuntime[];
  configurationParameters: ConfigurationParameterDefinition[];
  maintainers: MaintainerDefinition[];

  constructor(definition: PluginDefinition) {
    validatePluginDefinition(definition);
    // Throw exceptions if the plugin definition is invalid (custom)

    this.title = definition.title;
    this.description = definition.description;
    this.actions = definition.actions.map((actionDefinition) => new Action(actionDefinition, this));
    this.configurationParameters = definition.configurationParameters;
    this.maintainers = definition.maintainers;
  }

  findActionByKey(key: string): ActionRuntime | undefined {
    return this.actions.find((action) => action.key === key);
  }
}
