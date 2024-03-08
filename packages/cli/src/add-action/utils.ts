import { input, select } from '@inquirer/prompts';
import { logEmptyLine, logError, logErrorBody, logSuccess, styleAnswer, styleError, styleQuestion } from '../shared';
import { AddActionParameters } from './types';

export async function collectUserInput(): Promise<AddActionParameters> {
  logEmptyLine();

  const answers = {
    actionTitle: await input({
      message: styleQuestion('What is the action title?', '(e.g.: My test action)'),
      transformer: styleAnswer,
      validate: (value: string) => {
        if (value.trim() === '') {
          return styleError('Please enter the action title');
        }
        return true;
      },
    }),
    actionDescription: await input({
      message: styleQuestion('What is the action description?', '(optional)'),
      transformer: styleAnswer,
    }),
    actionType: await select({
      message: styleQuestion('Select the action type'),
      choices: [
        { name: 'Create', value: 'create' },
        { name: 'Read', value: 'read' },
        { name: 'Update', value: 'update' },
        { name: 'Delete', value: 'delete' },
      ],
    }),
  };

  return {
    key: toCamelCase(answers.actionTitle.trim()),
    title: answers.actionTitle.trim(),
    description: answers.actionDescription.trim(),
    type: answers.actionType.trim(),
  };
}

export function showSuccessMessage(): void {
  logSuccess('Action is successfully added');
  logEmptyLine();
}

export function showErrorMessage(error: string): void {
  logError('Error occurred while adding action');
  logErrorBody(error);
}

function toCamelCase(str: string) {
  return str
    .replace(/[^a-zA-Z\s]/g, '') // Remove all non-alphabetic characters
    .split(' ') // Split the string into an array of words
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    ) // First word in lowercase, and capitalize the first letter of subsequent words
    .join(''); // Join the words back into a single string without spaces
}
