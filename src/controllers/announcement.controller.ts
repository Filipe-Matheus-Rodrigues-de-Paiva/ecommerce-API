import { Request, Response } from "express";
import { AnnouncementService } from "../services/announcement.services";

export class AnnouncementController {
  constructor(private announcementService: AnnouncementService) {}

  async create(request: Request, response: Response): Promise<Response> {
    const { sub } = response.locals.decoded;
    const newAnnouncement = await this.announcementService.create(
      request.body,
      sub
    );

    return response.status(201).json(newAnnouncement);
  }

  async list(request: Request, response: Response): Promise<Response> {
    const announcements = await this.announcementService.list();

    return response.status(200).json(announcements);
  }

  async retrieve(request: Request, response: Response): Promise<Response> {
    const announcement = await this.announcementService.retrieve(
      request.params.announcementId
    );

    return response.status(200).json(announcement);
  }

  async listByUser(request: Request, response: Response): Promise<Response> {
    const sellerAnnouncements = await this.announcementService.listAllByUser(
      request.params.userId
    );

    return response.status(200).json(sellerAnnouncements);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { sub } = response.locals.decoded;
    const updatedUser = await this.announcementService.update(
      request.body,
      request.params.announcementId,
      sub
    );

    return response.status(200).json(updatedUser);
  }

  async destroy(
    request: Request,
    response: Response
  ): Promise<Response | void> {
    const { sub } = response.locals.decoded;
    await this.announcementService.destroy(request.params.announcementId, sub);
    return response.status(204).json();
  }
}
