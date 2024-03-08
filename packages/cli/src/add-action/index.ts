import { addAction } from './generator';
import { collectUserInput, showErrorMessage, showSuccessMessage } from './utils';

export default async function (): Promise<void> {
  try {
    const answers = await collectUserInput();
    await addAction(answers);
    showSuccessMessage();
  } catch (error: any) {
    showErrorMessage(error.message);
    throw error;
  }
}
