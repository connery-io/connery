import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

export function validateEnvConfig(config: Record<string, any>): Record<string, any> {
  const requiredEnvSchema = z.object({
    PLUGIN_URL: z
      .string()
      .url()
      .regex(/^(http:\/\/|https:\/\/).*/, 'The URL must start with http:// or https://'),
    API_KEY: z.string().min(32),
  });

  const result = requiredEnvSchema.safeParse(config);
  if (!result.success) {
    const prefix = '[Environment configuration validation error]';
    const prefixSeparator = ' ';
    const userFriendlyValidationError = fromZodError(result.error, { prefix, prefixSeparator });
    throw new Error(userFriendlyValidationError.message);
  }

  // Merge validated required variables with all other variables (including optional ones)
  return {
    ...config,
    ...result.data,
  };
}
