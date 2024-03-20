import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const createPaperSchema = z.object({
  title: z.string(),
  author: z.string(),
  collectionId: z.string(),
  fileUrl: z.string(),
  tags: z.string().array().optional(),
});

export type CreatePaperInput = z.infer<typeof createPaperSchema>;

const createSignedUrlSchema = z.object({
  filename: z.string(),
  contentType: z.string(),
});

export type CreateSignedUrlInput = z.infer<typeof createSignedUrlSchema>;

export const { schemas: paperSchemas, $ref } = buildJsonSchemas(
  {
    createPaperSchema,
    createSignedUrlSchema,
  },
  { $id: 'paper-schema' }
);
