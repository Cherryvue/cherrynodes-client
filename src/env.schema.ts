import * as Joi from 'joi';

export const envSchema = Joi.object({
  PORT: Joi.number().required(),
  STORAGE_KEY: Joi.string().required(),
});
