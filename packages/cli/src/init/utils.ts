import { input } from '@inquirer/prompts';
import { logEmptyLine, logError, logErrorBody, logSuccess, styleAnswer, styleError, styleQuestion } from '../shared';
import { InitRepositoryParameters } from './types';

export async function collectUserInput(): Promise<InitRepositoryParameters> {
  logEmptyLine();

  const answers = {
    pluginTitle: await input({
      message: styleQuestion('What is the plugin title?', '(e.g.: My test plugin)'),
      transformer: styleAnswer,
      validate: (value: string) => {
        if (value.trim() === '') {
          return styleError('Please enter the plugin title');
        }
        return true;
      },
    }),
    pluginDescription: await input({
      message: styleQuestion('What is the plugin description?', '(optional)'),
      transformer: styleAnswer,
    }),
    authorName: await input({
      message: styleQuestion('What is the mainainer name?'),
      transformer: styleAnswer,
      validate: (value: string) => {
        if (value.trim() === '') {
          return styleError('Please enter the maintainer name');
        }
        return true;
      },
    }),
    authorEmail: await input({
      message: styleQuestion('What is the maintainer email?'),
      transformer: styleAnswer,
      validate: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(value);

        if (value.trim() === '') {
          return styleError('Please enter the maintainer email');
        }

        if (!isValidEmail) {
          return styleError('Please enter a valid email address');
        }

        return true;
      },
    }),
  };

  return {
    plugin: {
      title: answers.pluginTitle.trim(),
      description: answers.pluginDescription.trim() || `Plugin for Connery.`,
    },
    maintainer: {
      name: answers.authorName.trim(),
      email: answers.authorEmail.trim(),
    },
    year: new Date().getFullYear(),
  };
}

export async function removeFile(filePath: string): Promise<void> {
  const fs = await import('fs');
  return new Promise((resolve) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        // ignore error if file doesn't exist
        resolve();
      } else {
        resolve();
      }
    });
  });
}

export function showSuccessMessage(): void {
  logSuccess('Plugin repository is successfully initialized');
  logEmptyLine();
}

export function showErrorMessage(error: string): void {
  logError('Error occurred while initializing plugin repository');
  logErrorBody(error);
}
