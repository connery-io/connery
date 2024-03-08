import { PluginFileNotFoundError, PluginLoader } from 'lib';
import { logEmptyLine, fullPluginFilePath } from '../shared';
import {
  collectActionInputParameters,
  collectActionKey,
  collectConfigurationParameters,
  showActionRunningMessage,
  showActionsLoadingMessage,
  showError,
  showResult,
  showShortcutCommand,
} from './utils';
import { ActionDefinition, ConfigurationParametersObject, InputParametersObject } from ':src/sdk/types';

export default async function (
  actionKey: string,
  options: { configurationParameters: string; inputParameters: string },
) {
  try {
    const collectedData: {
      actionKey: string;
      configurationParameters: ConfigurationParametersObject;
      inputParameters: InputParametersObject;
    } = {
      // Set data from command line arguments
      configurationParameters: JSON.parse(options.configurationParameters),
      actionKey: actionKey,
      inputParameters: JSON.parse(options.inputParameters),
    };

    // Add a line break after the command line arguments
    logEmptyLine();

    const pluginLoader = new PluginLoader('cli');
    try {
      await pluginLoader.init(fullPluginFilePath);
    } catch (error) {
      if (error instanceof PluginFileNotFoundError) {
        throw new Error(`${error.message} Try to build the plugin first.`);
      } else {
        throw error;
      }
    }
    const configurationParameterDefinitions = await pluginLoader.configurationParameterDefinitions;

    // Collect configuration parameters if not provided
    if (
      Object.keys(collectedData.configurationParameters).length === 0 &&
      configurationParameterDefinitions.length > 0
    ) {
      collectedData.configurationParameters = await collectConfigurationParameters(configurationParameterDefinitions);
    }

    if (!collectedData.actionKey) {
      showActionsLoadingMessage();
    }
    const plugin = await pluginLoader.getPlugin('local', collectedData.configurationParameters);

    // Collect action key if not provided
    if (!collectedData.actionKey) {
      collectedData.actionKey = await collectActionKey(plugin.definition.actions as ActionDefinition[]);
    }

    const action = plugin.getActionByKey(collectedData.actionKey);

    // Collect input parameters if not provided
    if (Object.keys(collectedData.inputParameters).length === 0 && action.definition.inputParameters.length > 0) {
      collectedData.inputParameters = await collectActionInputParameters(action.definition.inputParameters);
    }

    // If a bare or incomplete CLI command was used to run the action, show a shortcut
    if (!actionKey || options.configurationParameters === '{}' || options.inputParameters == '{}') {
      showShortcutCommand(
        collectedData.actionKey,
        collectedData.configurationParameters,
        collectedData.inputParameters,
      );
    }

    // Run the action
    showActionRunningMessage();
    const result = await action.run(collectedData.inputParameters);

    // Show the result
    showResult(result.output);
  } catch (error: any) {
    showError(error.message);
    throw error;
  }
}
