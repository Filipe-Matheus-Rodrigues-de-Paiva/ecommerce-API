import { z } from "zod";
import {
  userSchemaRequest,
  userSchemaReturn,
  userSchemaUpdateRequest,
  userSchemaUpdateReturn,
} from "../schemas/user.schema";
import { DeepPartial } from "typeorm";

type TUser = z.infer<typeof userSchemaReturn>;

type TUserRequest = z.infer<typeof userSchemaRequest>;

type TUserUpdateRequest = DeepPartial<typeof userSchemaUpdateRequest>;

type TUserUpdateReturn = z.infer<typeof userSchemaUpdateReturn>;

export { TUser, TUserRequest, TUserUpdateRequest, TUserUpdateReturn };
