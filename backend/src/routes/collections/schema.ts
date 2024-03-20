import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const createCollectionSchema = z.object({
  name: z.string(),
  emoji: z.string(),
});

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>;

export const { schemas: collectionSchemas, $ref } = buildJsonSchemas(
  {
    createCollectionSchema,
  },
  { $id: 'collection-schema' }
);
