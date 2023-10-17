import { DeepPartial } from "typeorm";
import { AppDataSource } from "../data-source";
import { Address, User } from "../entities";
import AppError from "../error";
import {
  userSchemaReturn,
  userSchemaUpdateReturn,
} from "../schemas/user.schema";
import { TUser, TUserRequest } from "../types/user.types";
import { hash, hashSync } from "bcryptjs";
import { randomUUID } from "crypto";
import { emailService } from "../utils/sendEmail.utils";

export class UserService {
  async create({ address, ...payload }: TUserRequest): Promise<TUser> {
    const userRepo = AppDataSource.getRepository(User);
    const addressRepo = AppDataSource.getRepository(Address);

    // verificar se já existe usuário com cpf
    const foundUser = await userRepo.findOneBy({
      cpf: payload.cpf,
    });

    // verificar se já existe usuário com email
    const foundUserByEmail = await userRepo.findOneBy({ email: payload.email });

    if (foundUser || foundUserByEmail) {
      throw new AppError("Usuário já existe", 409);
    }

    // verificar se password = confirm

    if (payload.password !== payload.confirm) {
      throw new AppError("Senhas não batem", 400);
    }

    const newAddress = addressRepo.create(address);
    await addressRepo.save(newAddress);

    const newUser = userRepo.create({ ...payload, address: newAddress });
    await userRepo.save(newUser);

    return userSchemaReturn.parse(newUser);
  }

  async retrieve(userId: string): Promise<TUser> {
    const userRepo = AppDataSource.getRepository(User);

    const loggedUser = await userRepo.findOne({
      where: { id: userId },
      relations: { address: true },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        phone_number: true,
        date_birth: true,
        description: true,
        account_type: true,
        address: { id: true, street: true, city: true, state: true },
      },
    });

    if (!loggedUser) throw new AppError("User not found", 404);

    return loggedUser;
  }

  async read(): Promise<TUser[]> {
    const userRepo = AppDataSource.getRepository(User);

    const users = await userRepo.find();

    const sellers = users.filter((user) => user.account_type === "anunciante");

    return sellers;
  }

  async update(
    payload: DeepPartial<Omit<TUserRequest, "address">>,
    userId: string
  ): Promise<any> {
    const userRepo = AppDataSource.getRepository(User);

    const foundUser = await userRepo.findOneBy({ id: userId });

    if (!foundUser) throw new AppError("User not found", 404);

    if (payload.password) {
      payload.password = await hash(payload.password, 10);
    }

    const updatedUser = await userRepo.save({ ...foundUser, ...payload });

    return userSchemaUpdateReturn.parse(updatedUser);
  }

  async destroy(userId: string): Promise<Response | void> {
    const userRepo = AppDataSource.getRepository(User);

    const foundUser = await userRepo.findOneBy({ id: userId });

    if (!foundUser) throw new AppError("User not found", 404);

    await userRepo.remove(foundUser);
  }

  async sendResetEmailPassword(email: string) {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError("user not found", 404);
    }

    const resetToken = randomUUID();

    await userRepo.save({
      ...user,
      reset_token: resetToken,
    });

    const resetPasswordTemplate = emailService.resetPasswordTemplate(
      email,
      user.name,
      resetToken
    );
    await emailService.sendEmail(resetPasswordTemplate);
  }

  async resetPassword(password: string, resetToken: string) {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { reset_token: resetToken },
    });

    if (!user) {
      throw new AppError("user not found", 404);
    }

    await userRepo.save({
      ...user,
      password: hashSync(password, 10),
      reset_token: null,
    });
  }
}
