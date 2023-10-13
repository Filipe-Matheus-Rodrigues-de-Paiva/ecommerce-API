import { Request, Response } from "express";
import { CommentService } from "../services/comment.services";

export class CommentController {
  constructor(private commentService: CommentService) {}

  async create(request: Request, response: Response) {
    const { sub } = response.locals.decoded;

    const newComment = await this.commentService.create(
      request.body,
      sub,
      request.params.announcementId
    );

    return response.status(201).json(newComment);
  }

  async read(request: Request, response: Response) {
    const commentsByAnnouncement = await this.commentService.read(
      request.params.announcementId
    );

    return response.status(200).json(commentsByAnnouncement);
  }

  async readAll(request: Request, response: Response) {
    const comments = await this.commentService.readAll();
    return response.status(200).json(comments);
  }

  async update(request: Request, response: Response) {
    const { sub } = response.locals.decoded;

    const updatedComment = await this.commentService.update(
      request.body,
      request.params.commentId,
      sub
    );

    return response.status(200).json(updatedComment);
  }

  async destroy(request: Request, response: Response) {
    const { sub } = response.locals.decoded;
    await this.commentService.destroy(request.params.commentId, sub);

    return response.status(204).json();
  }
}
