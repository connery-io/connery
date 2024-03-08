// @ts-ignore: Suppresses TS1479
import chalk from 'chalk';

const successColor = '#00ff00';
const errorColor = '#ff0000';
const questionColor = '#362490';
const infoColor = '#000000';
const tipColor = '#dedede';
const additionalDataColor = 'eeeeee';

export const pluginFilePath = `/dist/plugin.js`;
export const fullPluginFilePath = `${process.cwd()}${pluginFilePath}`;

export function styleQuestion(question: string, description?: string) {
  const styleQuestion = chalk.reset.hex(questionColor).bold(question);

  if (description) {
    const styleDescription = chalk.reset.hex(additionalDataColor)(description);
    return `${styleQuestion} ${styleDescription}`;
  } else {
    return `${styleQuestion}`;
  }
}

export function styleAnswer(answer: string) {
  return chalk.hex(questionColor)(answer);
}

export function styleError(message: string) {
  return chalk.reset.hex(errorColor)(message);
}

export function logQuestionSectionTitle(message: string) {
  const logMessage = chalk.reset.hex(questionColor).bold(message);
  console.log(logMessage);
}

export function logInfo(message: string) {
  const logMessage = chalk.reset.hex(infoColor)(message);
  console.log(logMessage);
}

export function logTip(message: string) {
  const logMessage = chalk.reset.hex(tipColor)(message);
  console.log(logMessage);
}

export function logSuccess(message: string) {
  const logMessage = chalk.reset.hex(successColor).bold(message);
  console.log(`✅ ${logMessage}`);
}

export function logError(message: string) {
  const logMessage = chalk.reset.hex(errorColor).bold(message);
  console.log(`🔴 ${logMessage}`);
}

export function logErrorBody(message: string) {
  const logMessage = chalk.reset.hex(errorColor)(message);
  console.log(logMessage);
}

export function logEmptyLine() {
  console.log('');
}
