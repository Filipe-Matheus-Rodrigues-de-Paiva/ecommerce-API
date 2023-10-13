import { Request, Response } from "express";
import { UserService } from "../services/user.services";

export class UserController {
  constructor(private userService: UserService) {}

  async create(request: Request, response: Response): Promise<Response> {
    const newUser = await this.userService.create(request.body);

    return response.status(201).json(newUser);
  }

  async retrieve(request: Request, response: Response): Promise<Response> {
    const user = await this.userService.retrieve(request.params.userId);
    return response.status(200).json(user);
  }

  async read(request: Request, response: Response): Promise<Response> {
    const users = await this.userService.read();
    return response.status(200).json(users);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const updatedUser = await this.userService.update(
      request.body,
      request.params.userId
    );
    return response.status(200).json(updatedUser);
  }

  async destroy(
    request: Request,
    response: Response
  ): Promise<Response | void> {
    await this.userService.destroy(request.params.userId);
    return response.status(204).json();
  }
}
