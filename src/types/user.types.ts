import { z } from "zod";
import {
  userSchemaRequest,
  userSchemaReturn,
  userSchemaUpdateRequest,
} from "../schemas/user.schema";
import { DeepPartial } from "typeorm";

type TUser = z.infer<typeof userSchemaReturn>;

type TUserRequest = z.infer<typeof userSchemaRequest>;

type TUserUpdateRequest = DeepPartial<typeof userSchemaUpdateRequest>;

export { TUser, TUserRequest, TUserUpdateRequest };
