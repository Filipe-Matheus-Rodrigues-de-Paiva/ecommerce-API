import { z } from "zod";

const sessionSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(150),
});

export { sessionSchema };
