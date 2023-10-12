import { formatDistanceToNow } from "date-fns";
import { AppDataSource } from "../data-source";
import { Announcement, Comment, User } from "../entities";
import AppError from "../error";
import { commentSchema } from "../schemas/comment.schema";
import { TComment, TCommentRequest } from "../types";
import { DeepPartial } from "typeorm";
import { UserType } from "../entities/user.entity";
import { ptBR } from "date-fns/locale";

interface ICreatedComment {
  comment: TComment;
  timeElapsed: string;
}

export class CommentService {
  private calculateTimeElapsed(comment: Comment): string {
    return formatDistanceToNow(comment.updatedAt, {
      addSuffix: true,
      locale: ptBR,
    });
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
    const commentRepo = AppDataSource.getRepository(Comment);

    const foundAnnouncement = await announcementRepo.findOne({
      where: { id: announcementId },
      relations: { comments: true, user: true },
    });

    if (!foundAnnouncement) throw new AppError("Announcement not found", 404);

    const comments = await commentRepo.find({
      where: { announcement: { id: foundAnnouncement.id } },
      relations: { user: true },
      select: {
        id: true,
        text: true,
        createdAt: true,
        updatedAt: true,
        user: { name: true, email: true },
      },
    });

    const commentsWithTimeElapsed = comments.map((comment) => {
      const timeElapsed = this.calculateTimeElapsed(comment);

      return { ...comment, timeElapsed };
    });

    return commentsWithTimeElapsed;
  }

  async update(
    payload: DeepPartial<TCommentRequest>,
    commentId: string,
    userId: string
  ): Promise<any> {
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

    return {
      comment: commentSchema.parse(comment),
      timeElapsed: this.calculateTimeElapsed(comment),
    };
  }

  async destroy(commentId: string, userId: string): Promise<Response | void> {
    const commentRepo = AppDataSource.getRepository(Comment);
    const userRepo = AppDataSource.getRepository(User);
    const announcementRepo = AppDataSource.getRepository(Announcement);

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

    const foundAnnouncement = await announcementRepo.findOne({
      where: { id: comment.announcement.id },
      relations: { user: true },
    });

    if (
      user?.account_type === UserType.ANUNCIANTE &&
      foundAnnouncement?.user.id === userId
    ) {
      await commentRepo.remove(comment);
    } else if (comment.user.id !== userId) {
      throw new AppError("Comment does not belong to this user!");
    } else {
      await commentRepo.remove(comment);
    }
  }
}
