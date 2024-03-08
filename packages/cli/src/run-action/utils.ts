import {
  ActionDefinition,
  ConfigurationParameterDefinition,
  ConfigurationParametersObject,
  InputParameterDefinition,
  InputParametersObject,
  OutputParametersObject,
} from '@connery-io/sdk';
import {
  logEmptyLine,
  logError,
  logErrorBody,
  logInfo,
  logQuestionSectionTitle,
  logSuccess,
  logTip,
  styleAnswer,
  styleError,
  styleQuestion,
} from '../shared';
import { input, select } from '@inquirer/prompts';

export async function collectConfigurationParameters(
  configurationParameterDefinitions: ConfigurationParameterDefinition[],
): Promise<ConfigurationParametersObject> {
  const result: ConfigurationParametersObject = {};

  logQuestionSectionTitle('Specify configuration parameters for the plugin');
  logEmptyLine();

  for (const param of configurationParameterDefinitions) {
    result[param.key] = await input({
      message: styleQuestion(param.title, param.key),
      transformer: styleAnswer,
      validate: (value: string) => {
        if (param.validation?.required && value.trim() === '') {
          return styleError('Configuration parameter is required');
        }
        return true;
      },
    });
  }

  logEmptyLine();

  return result;
}

export function showActionsLoadingMessage(): void {
  logInfo('Loading actions...');
  logEmptyLine();
}

export function showActionRunningMessage(): void {
  logInfo('Running action...');
  logEmptyLine();
}

export async function collectActionKey(actionDefinitions: ActionDefinition[]): Promise<string> {
  const actionKey = await select({
    message: styleQuestion('What action do you want to run?'),
    choices: actionDefinitions.map((action) => ({ name: action.key, value: action.key })),
  });
  logEmptyLine();

  return actionKey;
}

export async function collectActionInputParameters(
  inputParameterDefinitions: InputParameterDefinition[],
): Promise<InputParametersObject> {
  const result: InputParametersObject = {};

  logQuestionSectionTitle('Specify input parameters for the action');
  logEmptyLine();

  for (const param of inputParameterDefinitions) {
    result[param.key] = await input({
      message: styleQuestion(param.title, param.key),
      transformer: styleAnswer,
      validate: (value: string) => {
        if (param.validation?.required && value.trim() === '') {
          return styleError('Input parameter is required');
        }
        return true;
      },
    });
  }

  logEmptyLine();

  return result;
}

export function showResult(result: OutputParametersObject) {
  logSuccess('Action is successfully executed with the following result');
  logEmptyLine();
  logInfo(JSON.stringify(result, null, 2));
  logEmptyLine();
}

export function showShortcutCommand(
  actionKey: string,
  configurationParameters: ConfigurationParametersObject,
  inputParameters: InputParametersObject,
) {
  const configurationParametersJson = JSON.stringify(configurationParameters);
  const inputParametersJson = JSON.stringify(inputParameters);

  logTip(
    'SHORTCUT: Next time you need to run the same action with the same parameters, you can use the following command:',
  );
  logTip(
    `npx connery@latest dev run-action ${actionKey} --configuration-parameters '${configurationParametersJson}' --input-parameters '${inputParametersJson}'`,
  );
  logEmptyLine();
}

export function showError(error: string) {
  logError('Error occurred while running action');
  logErrorBody(error);
  logEmptyLine();
}
