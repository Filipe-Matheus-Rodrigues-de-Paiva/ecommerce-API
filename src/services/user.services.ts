import { DeepPartial } from "typeorm";
import { AppDataSource } from "../data-source";
import { Address, User } from "../entities";
import AppError from "../error";
import { userSchemaReturn } from "../schemas/user.schema";
import { TUser, TUserRequest } from "../types/user.types";

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
      throw new AppError("User already exists", 409);
    }

    // verificar se password = confirm

    if (payload.password !== payload.confirm) {
      throw new AppError("passwords do not match", 400);
    }

    const newAddress = addressRepo.create(address);
    await addressRepo.save(newAddress);

    const newUser = userRepo.create({ ...payload, address: newAddress });
    await userRepo.save(newUser);

    return userSchemaReturn.parse(newUser);
  }

  async update(
    payload: DeepPartial<Omit<TUserRequest, "address">>,
    userId: string
  ): Promise<TUser> {
    const userRepo = AppDataSource.getRepository(User);

    const foundUser = await userRepo.findOneBy({ id: userId });

    if (!foundUser) throw new AppError("User not found", 404);

    const updatedUser = await userRepo.save({ ...foundUser, ...payload });

    return userSchemaReturn.parse(updatedUser);
  }

  async destroy(userId: string): Promise<Response | void> {
    const userRepo = AppDataSource.getRepository(User);

    const foundUser = await userRepo.findOneBy({ id: userId });

    if (!foundUser) throw new AppError("User not found", 404);

    await userRepo.remove(foundUser);
  }
}
