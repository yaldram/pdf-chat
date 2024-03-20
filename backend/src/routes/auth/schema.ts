import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const registerSchema = z.object({
  fullname: z.string(),
  username: z.string(),
  password: z.string(),
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: authSchemas, $ref } = buildJsonSchemas(
  {
    registerSchema,
    loginSchema,
  },
  { $id: 'register-schema' }
);
