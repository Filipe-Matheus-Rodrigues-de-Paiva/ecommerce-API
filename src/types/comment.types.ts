import { z } from "zod";
import { commentPayloadSchema, commentSchema } from "../schemas/comment.schema";

type TComment = z.infer<typeof commentSchema>;

type TCommentRequest = z.infer<typeof commentPayloadSchema>;

export { TComment, TCommentRequest };
