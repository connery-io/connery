import { PluginDefinition } from '../../types/definition.js';
import { fromZodError } from 'zod-validation-error';
import * as zod from 'zod';

const keyRegex = /^[a-z][a-zA-Z0-9]*$/;
const keyRegexMessage = 'Key must be in camelCase and start with a letter';
const prefix = '[Plugin definition validation error]';
const prefixSeparator = ' ';

//
// Validation functions
//

export function validatePluginDefinition(plugin: PluginDefinition): void {
  try {
    PluginSchema.parse(plugin);
  } catch (error: any) {
    const userFriendlyValidationError = fromZodError(error, { prefix, prefixSeparator });
    throw new Error(userFriendlyValidationError.message);
  }
}

//
// Schemas
//

const ValidationSchema = zod
  .object({
    required: zod.boolean().optional(),
  })
  .strict();

const InputParameterSchema = zod
  .object({
    key: zod.string().regex(keyRegex, { message: keyRegexMessage }).min(1).max(50),
    title: zod.string().min(1).max(100),
    description: zod.string().max(2000).optional(),
    type: zod.enum(['string']),
    validation: ValidationSchema.optional(),
  })
  .strict();

const OutputParameterSchema = zod
  .object({
    key: zod.string().regex(keyRegex, { message: keyRegexMessage }).min(1).max(50),
    title: zod.string().min(1).max(100),
    description: zod.string().max(2000).optional(),
    type: zod.enum(['string']),
    validation: ValidationSchema.optional(),
  })
  .strict();

const OperationSchema = zod
  .object({
    handler: zod.function(),
  })
  .strict();

const ActionSchema = zod
  .object({
    key: zod.string().regex(keyRegex, { message: keyRegexMessage }).min(1).max(50),
    title: zod.string().min(1).max(100),
    description: zod.string().max(2000).optional(),
    type: zod.enum(['create', 'read', 'update', 'delete']),
    inputParameters: zod
      .array(InputParameterSchema)
      .refine(uniqueKeysValidator, { message: 'Input parameters must have unique keys' }),
    operation: OperationSchema,
    outputParameters: zod
      .array(OutputParameterSchema)
      .refine(uniqueKeysValidator, { message: 'Output parameters must have unique keys' }),
  })
  .strict();

const ConfigurationParameterSchema = zod
  .object({
    key: zod.string().regex(keyRegex, { message: keyRegexMessage }).min(1).max(50),
    title: zod.string().min(1).max(100),
    description: zod.string().max(2000).optional(),
    type: zod.enum(['string']),
    validation: ValidationSchema.optional(),
  })
  .strict();

const MaintainerSchema = zod
  .object({
    name: zod.string().min(1).max(100),
    email: zod.string().email().min(1).max(100),
  })
  .strict();

const ActionsType = zod.union([
  zod.array(ActionSchema).min(1).refine(uniqueKeysValidator, { message: 'Actions must have unique keys' }),
  zod.function(),
]);

const PluginSchema = zod
  .object({
    title: zod.string().min(1).max(100),
    description: zod.string().max(2000).optional(),
    actions: ActionsType,
    configurationParameters: zod
      .array(ConfigurationParameterSchema)
      .refine(uniqueKeysValidator, { message: 'Configuration parameters must have unique keys' }),
    maintainers: zod.array(MaintainerSchema).min(1),
  })
  .strict();

//
// Custom validators
//

function uniqueKeysValidator(array: any[]) {
  const keys = array.map((item: { key: string }) => item.key);
  return new Set(keys).size === keys.length;
}
