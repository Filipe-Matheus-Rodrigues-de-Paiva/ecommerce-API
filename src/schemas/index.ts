import {
  announcementSchema,
  announcementSchemaRequest,
  announcementUpdateSchemaRequest,
} from "./announcement.schema";

import {
  userSchema,
  userSchemaRequest,
  userSchemaReturn,
  userSchemaUpdateRequest,
} from "./user.schema";

import { sessionSchema } from "./session.schemas";

import { commentSchema, commentPayloadSchema } from "./comment.schema";

export default {
  announcementSchema,
  announcementSchemaRequest,
  announcementUpdateSchemaRequest,
  userSchema,
  userSchemaRequest,
  userSchemaUpdateRequest,
  userSchemaReturn,
  sessionSchema,
  commentSchema,
  commentPayloadSchema,
};
