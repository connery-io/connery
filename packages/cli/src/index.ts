#!/usr/bin/env node

import { Command } from 'commander';
import init from './init';
import addAction from './add-action';
import validate from './_validate';
import runAction from './run-action';
import { pluginFilePath } from './shared';

const program = new Command();

// prettier-ignore
program.name('connery')
  .description('Connery CLI')
  .helpOption('-h, --help', 'Display help for command');

// prettier-ignore
const devCommand = new Command('dev')
  .description('Plugin development commands')
  .helpOption('-h, --help', 'Display help for command');

// prettier-ignore
devCommand
  .command('init')
  .description('Initialize repository for a new Connery plugin')
  .action(init)
  .helpOption('-h, --help', 'Display help for command');

// prettier-ignore
devCommand
  .command('add-action')
  .description('Add a new action to the plugin')
  .addHelpText('after', `\nThe plugin must initialized before running this command.`)
  .action(addAction)
  .helpOption('-h, --help', 'Display help for command');

// prettier-ignore
devCommand
  .command('run-action [actionKey]')
  .option(
    '--configuration-parameters <configurationParameters>',
    'Configuration parameters in JSON string format',
    '{}',
  )
  .option('--input-parameters <inputParameters>', 'input parameters in JSON string format', '{}')
  .description('Run an action from the plugin')
  .addHelpText('after', `\nThe plugin must be built before running this command and the plugin file should be located at '${pluginFilePath}'.`)
  .action(runAction)
  .helpOption('-h, --help', 'Display help for command');

// prettier-ignore
//devCommand
//  .command('validate')
//  .description(`Validate plugin definition`)
//  .addHelpText('after', `\nThe plugin must be built before running this command and the plugin file should be located at '${pluginFilePath}'.`,)
//  .action(validate)
//  .helpOption('-h, --help', 'Display help for command');

program.addCommand(devCommand);
program.parse();
