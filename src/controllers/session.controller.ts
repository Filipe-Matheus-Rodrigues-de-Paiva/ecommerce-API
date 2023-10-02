import { Request, Response } from "express";
import { SessionService } from "../services/session.services";

export class SessionController {
  constructor(private sessionService: SessionService) {}

  async create(request: Request, response: Response) {
    const token = await this.sessionService.create(request.body);

    return response.status(200).json(token);
  }
}
