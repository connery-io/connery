// @ts-ignore: Suppresses TS1479
import nodePlop from 'node-plop';
import { InitRepositoryParameters } from './types';

import buildPluginTemplate from './templates/.github/workflows/build-plugin.yml';
import sampleActionTemplate from './templates/src/actions/sampleAction.ts';
import indexTemplate from './templates/src/index.ts';
import sampleActionTestTemplate from './templates/test/actions/sampleAction.test.ts';
import gitignoreTemplate from './templates/.gitignore';
import prettierTemplate from './templates/.prettierrc';
import jestConfigTemplate from './templates/jest.config.js.js';
import licenseTemplate from './templates/LICENSE';
import packageJsonTemplate from './templates/package.json';
import readmeTemplate from './templates/README.md';
import tsconfigTemplate from './templates/tsconfig.json';
import webpackConfigTemplate from './templates/webpack.config.js.js';

export async function initRepository(parameters: InitRepositoryParameters) {
  const plot = await nodePlop('');
  const generatorName = 'init-repository';

  plot.setGenerator(generatorName, {
    description: 'Init repository',
    actions: [
      {
        type: 'add',
        path: '.github/workflows/build-plugin.yml',
        template: buildPluginTemplate,
      },
      {
        type: 'add',
        path: 'src/actions/sampleAction.ts',
        template: sampleActionTemplate,
      },
      {
        type: 'add',
        path: 'src/index.ts',
        template: indexTemplate,
      },
      {
        type: 'add',
        path: 'test/actions/sampleAction.test.ts',
        template: sampleActionTestTemplate,
      },
      {
        type: 'add',
        path: '.gitignore',
        template: gitignoreTemplate,
      },
      {
        type: 'add',
        path: '.prettierrc',
        template: prettierTemplate,
      },
      {
        type: 'add',
        path: 'jest.config.js',
        template: jestConfigTemplate,
      },
      {
        type: 'add',
        path: 'LICENSE',
        template: licenseTemplate,
      },
      {
        type: 'add',
        path: 'package.json',
        template: packageJsonTemplate,
      },
      {
        type: 'add',
        path: 'README.md',
        template: readmeTemplate,
      },
      {
        type: 'add',
        path: 'tsconfig.json',
        template: tsconfigTemplate,
      },
      {
        type: 'add',
        path: 'webpack.config.js',
        template: webpackConfigTemplate,
      },
    ],
  });

  const generator = plot.getGenerator(generatorName);
  await generator.runActions(parameters);
}
