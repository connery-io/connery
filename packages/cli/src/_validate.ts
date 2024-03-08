import { PluginFileNotFoundError, PluginLoader } from 'lib';
import { logEmptyLine, logError, logErrorBody, logInfo, logSuccess, fullPluginFilePath } from './shared';

export default async function (): Promise<void> {
  try {
    logEmptyLine();
    logInfo(`🔎 Validating plugin definition in '${fullPluginFilePath}' file...`);

    // Init the plugin. It will load the plugin definition to memory and validate it.
    // NOTE: If the 'actions' property is defined as a function, the function will not be executed,
    // so the definition of actions will not be validated at this point. It will be validated later when
    // the plugin is initialized.
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

    logSuccess('Plugin definition is valid');
    logEmptyLine();
  } catch (error: any) {
    logError('Error occurred while validating plugin definition');
    logErrorBody(error.message);
    throw error;
  }
}
