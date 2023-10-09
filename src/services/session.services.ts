import { compare } from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entities";
import AppError from "../error";
import { sign } from "jsonwebtoken";

export class SessionService {
  async create(payload: { email: string; password: string }) {
    const userRepo = AppDataSource.getRepository(User);

    const user: User | null = await userRepo.findOneBy({
      email: payload.email,
    });

    if (!user) throw new AppError("Invalid credentials", 401);

    const passwordMatch: boolean = await compare(
      payload.password,
      user.password
    );

    if (!passwordMatch) throw new AppError("Invalid credentials", 401);

    const token: string = sign(
      { email: user.email, account_type: user.account_type, name: user.name },
      process.env.SECRET_KEY!,
      { subject: user.id.toString(), expiresIn: "24h" }
    );

    return { token };
  }
}
