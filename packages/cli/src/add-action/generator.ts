// @ts-ignore: Suppresses TS1479
import nodePlop from 'node-plop';
import { AddActionParameters } from './types.js';

import actionTemplate from './templates/action.ts.js';
import actionTestTemplate from './templates/action.test.ts.js';

export async function addAction(parameters: AddActionParameters) {
  const plot = await nodePlop('');
  const generatorName = 'add-action';

  plot.setGenerator(generatorName, {
    description: 'Add action',
    actions: [
      {
        type: 'add',
        path: 'src/actions/{{key}}.ts',
        template: actionTemplate,
      },
      {
        type: 'add',
        path: 'test/actions/{{key}}.test.ts',
        template: actionTestTemplate,
      },
      {
        type: 'modify', // Import the new action in the index.ts file
        path: 'src/index.ts',
        transform: (fileContents: any, answers: any) => {
          const sdkImport = "import { PluginDefinition } from '@connery-io/sdk';\n";
          const newImport = `import ${answers.key} from './actions/${answers.key}';\n`;

          // Check if the import statement already exists to prevent duplicates
          if (fileContents.includes(newImport.trim())) {
            return fileContents; // If it exists, return the file contents unmodified
          }

          // Replace the sdkImport line with itself followed by the new import line
          return fileContents.replace(sdkImport, sdkImport + newImport);
        },
      },
      {
        type: 'modify', // Add the new action to the actions array
        path: 'src/index.ts',
        transform: (fileContents: any, answers: any) => {
          // Define the newItem to be added
          const newItem = answers.key;
          // Define a RegExp pattern to match the actions array
          const actionsPattern = /actions:\s*\[\s*([^]*?)\s*\]/gm;

          // Replace the content by using String.replace with a callback function
          return fileContents.replace(actionsPattern, (match: any, actionContent: any) => {
            // Check if 'newItem' already exists to prevent duplicates
            if (actionContent.includes(newItem)) {
              return match; // If it exists, return the original match
            }

            // Determine if the action array is multiline based on the match
            const isMultiline = match.trim().endsWith('],');

            // Prepare the formatted new action string
            const newActionFormatted = isMultiline ? `  ${newItem},\n` : `${newItem}, `;

            // Insert 'newItem' at the beginning of the actionContent
            // Preserve formatting by including new lines and spaces if multiline
            if (isMultiline) {
              return match.replace(/\[\s*/, `[\n  ${newActionFormatted}`);
            } else {
              return match.replace(/\[\s*/, `[${newActionFormatted}`);
            }
          });
        },
      },
      {
        type: 'modify',
        path: 'README.md',
        pattern: /(Description\s*\|\s*.*?\|(\r?\n))/g, // Add the new action to the beginning of the table
        template: '$1| [{{title}}](/src/actions/{{key}}.ts) | {{description}} |\n',
      },
    ],
  });

  const generator = plot.getGenerator(generatorName);
  await generator.runActions(parameters);
}
