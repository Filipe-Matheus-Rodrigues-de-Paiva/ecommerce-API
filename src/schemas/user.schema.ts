import { z } from "zod";
import { UserType } from "../entities/user.entity";

const userSchema = z
  .object({
    id: z.string(),
    name: z.string().max(150),
    email: z.string().email().max(100),
    cpf: z.string().max(17),
    phone_number: z.string().max(15),
    date_birth: z
      .string()
      .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
    description: z.string(),
    address: z.object({
      id: z.string(),
      cep: z.string().max(9),
      state: z.string().max(2),
      city: z.string().max(50),
      street: z.string().max(200),
      number: z.number(),
      complement: z.string().max(70),
    }),
    account_type: z.nativeEnum(UserType),
    password: z
      .string()
      .max(150)
      .min(8, "A senha necessita de 8 digitos no mínimo")
      .regex(/(?=.*?[A-Z])/)
      .regex(/(?=.*?[a-z])/)
      .regex(/(?=.*?[0-9])/)
      .regex(/(?=.*?[\W])/)
      .min(1, "É preciso pelo menos um caractere especial"),
    confirm: z.string().min(1, "Confirme sua senha"),
  })
  .refine(({ password, confirm }) => confirm === password, {
    message: "As senhas não estão em conformidade",
    path: ["confirm"],
  });

const userSchemaRequest = z.object({
  name: z.string().max(150),
  email: z.string().email().max(100),
  cpf: z.string().max(17),
  phone_number: z.string().max(15),
  date_birth: z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
  description: z.string(),
  address: z.object({
    cep: z.string().max(9),
    state: z.string().max(2),
    city: z.string().max(50),
    street: z.string().max(200),
    number: z.number(),
    complement: z.string().max(70),
  }),
  account_type: z.nativeEnum(UserType),
  password: z
    .string()
    .max(150)
    .min(8, "A senha necessita de 8 digitos no mínimo")
    .regex(/(?=.*?[A-Z])/, "É preciso pelo menos uma letra maiúscula")
    .regex(/(?=.*?[a-z])/, "É preciso pelo menos uma letra minúscula")
    .regex(/(?=.*?[0-9])/, "É preciso pelo menos um número")
    .regex(/(?=.*?[\W])/, "É preciso pelo menos um caractere especial")
    .min(1, "É preciso pelo menos um caractere especial"),
  confirm: z.string().min(1, "Confirme sua senha"),
});

const userSchemaReturn = z.object({
  id: z.string(),
  name: z.string().max(150),
  email: z.string().email().max(100),
  cpf: z.string().max(17),
  phone_number: z.string().max(15),
  date_birth: z
    .string()
    .regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/),
  description: z.string(),
  account_type: z.nativeEnum(UserType),
  address: z.object({
    id: z.string(),
    cep: z.string().max(9),
    state: z.string().max(2),
    city: z.string().max(50),
    street: z.string().max(200),
    number: z.number(),
    complement: z.string().max(70),
  }),
});

const userSchemaUpdateRequest = userSchemaRequest.omit({
  address: true,
});

export {
  userSchema,
  userSchemaRequest,
  userSchemaReturn,
  userSchemaUpdateRequest,
};
