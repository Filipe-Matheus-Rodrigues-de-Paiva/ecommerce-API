import { formatDistanceToNow } from "date-fns";
import { AppDataSource } from "../data-source";
import { Announcement, Comment, User } from "../entities";
import AppError from "../error";
import { commentSchema } from "../schemas/comment.schema";
import { TComment, TCommentRequest } from "../types";
import { DeepPartial } from "typeorm";
import { UserType } from "../entities/user.entity";

interface ICreatedComment {
  comment: TComment;
  timeElapsed: string;
}

export class CommentService {
  private calculateTimeElapsed(comment: Comment): string {
    return formatDistanceToNow(comment.createdAt, { addSuffix: true });
  }

  async create(
    payload: TCommentRequest,
    userId: string,
    announcementId: string
  ): Promise<ICreatedComment> {
    const commentRepo = AppDataSource.getRepository(Comment);
    const userRepo = AppDataSource.getRepository(User);
    const announcementRepo = AppDataSource.getRepository(Announcement);

    const loggedUser = await userRepo.findOneBy({ id: userId });

    if (!loggedUser) throw new AppError("No user is logged in!");

    const foundAnnouncement = await announcementRepo.findOneBy({
      id: announcementId,
    });

    if (!foundAnnouncement) throw new AppError("Announcement not found", 404);

    const newComment = commentRepo.create({
      ...payload,
      user: loggedUser,
      announcement: foundAnnouncement,
    });

    await commentRepo.save(newComment);

    const timeElapsed = this.calculateTimeElapsed(newComment);

    return { comment: commentSchema.parse(newComment), timeElapsed };
  }

  async read(announcementId: string): Promise<any> {
    const announcementRepo = AppDataSource.getRepository(Announcement);

    const foundAnnouncement = await announcementRepo.findOne({
      where: { id: announcementId },
      relations: { comments: true },
    });

    if (!foundAnnouncement) throw new AppError("Announcement not found", 404);

    const comments = foundAnnouncement.comments.map((comment) => {
      const timeElapsed = this.calculateTimeElapsed(comment);

      return { ...comment, timeElapsed };
    });

    return comments;
  }

  async update(
    payload: DeepPartial<TCommentRequest>,
    commentId: string,
    userId: string
  ): Promise<TComment | null> {
    const commentRepo = AppDataSource.getRepository(Comment);
    const userRepo = AppDataSource.getRepository(User);

    const comment = await commentRepo.findOneBy({ id: commentId });

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    const user = await userRepo.findOneBy({ comments: { id: comment.id } });

    if (user?.id !== userId)
      throw new AppError("Comment does not belong to this user!");

    if (!payload.text) throw new AppError("Missing fields", 400);

    comment.text = payload.text;

    await commentRepo.save(comment);

    return commentSchema.parse(comment);
  }

  async destroy(commentId: string, userId: string): Promise<Response | void> {
    const commentRepo = AppDataSource.getRepository(Comment);
    const userRepo = AppDataSource.getRepository(User);

    const comment = await commentRepo.findOne({
      where: {
        id: commentId,
      },
      relations: {
        user: true,
        announcement: true,
      },
    });

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    const user = await userRepo.findOneBy({ id: userId });

    if (user?.account_type === UserType.ANUNCIANTE) {
      if (comment.announcement.user.id === userId) {
        await commentRepo.remove(comment);
      } else {
        throw new AppError(
          "Seller can only delete comments of his/her own announcements",
          400
        );
      }
    } else {
      if (comment.user.id !== userId) {
        throw new AppError("Comment does not belong to this user!");
      }

      await commentRepo.remove(comment);
    }
  }
}
