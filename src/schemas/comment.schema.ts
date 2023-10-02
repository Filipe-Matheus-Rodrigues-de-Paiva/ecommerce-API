import { z } from "zod";

const commentSchema = z.object({
  id: z.string(),
  text: z.string(),
});

const commentPayloadSchema = commentSchema.omit({
  id: true,
});

export { commentSchema, commentPayloadSchema };
