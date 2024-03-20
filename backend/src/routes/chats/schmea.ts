import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const chatSchema = z.object({
  conversationId: z.string(),
  resourceId: z.array(z.string()).optional(),
  userQuery: z.string(),
});

export type ChatInput = z.infer<typeof chatSchema>;

export const { schemas: chatSchemas, $ref } = buildJsonSchemas(
  {
    chatSchema,
  },
  { $id: 'chat-schema' }
);
