import { AppDataSource } from "../data-source";
import { Announcement, Image, User } from "../entities";
import AppError from "../error";
import { announcementSchema } from "../schemas/announcement.schema";
import { TAnnouncement, TAnnouncementRequest } from "../types";

export class AnnouncementService {
  async create(
    { images, ...payload }: TAnnouncementRequest,
    userId: string
  ): Promise<TAnnouncement> {
    const announcementRepository = AppDataSource.getRepository(Announcement);
    const imagesRepository = AppDataSource.getRepository(Image);
    const userRepo = AppDataSource.getRepository(User);

    const loggedUser = await userRepo.findOneBy({ id: userId });

    if (!loggedUser) throw new AppError("No active user!", 404);

    let newImages = [];

    if (images) {
      for (const image of images) {
        const newImage = imagesRepository.create({
          ImageUrl: image.imageUrl,
        });
        await imagesRepository.save(newImage);
        newImages.push(newImage);
      }
    }

    const newAnnouncement = announcementRepository.create({
      ...payload,
      images: newImages,
      user: loggedUser,
    });

    await announcementRepository.save(newAnnouncement);

    return announcementSchema.parse(newAnnouncement);
  }

  async list(): Promise<Announcement[]> {
    const announcementRepository = AppDataSource.getRepository(Announcement);

    const announcements = await announcementRepository.find({
      relations: { images: true, user: true },
    });

    return announcements;
  }

  async retrieve(announcementId: string): Promise<Announcement> {
    const announcementRepository = AppDataSource.getRepository(Announcement);

    const announcementFound = await announcementRepository.findOneBy({
      id: announcementId,
    });

    if (!announcementFound) throw new AppError("Announcement not found", 404);

    return announcementFound;
  }

  async listAllByUser(userId: string): Promise<Announcement[]> {
    const userRepo = AppDataSource.getRepository(User);

    const foundUser = await userRepo.findOne({
      where: { id: userId },
      relations: { announcements: true },
    });

    if (!foundUser) throw new AppError("User not found", 404);

    if (foundUser.account_type !== "anunciante") {
      throw new AppError("User is not a seller", 400);
    }

    return foundUser.announcements;
  }

  async update(
    payload: any,
    announcementId: string,
    userId: string
  ): Promise<TAnnouncement> {
    const announcementRepo = AppDataSource.getRepository(Announcement);
    const userRepo = AppDataSource.getRepository(User);

    const loggedUser = await userRepo.findOneBy({ id: userId });

    if (!loggedUser) throw new AppError("No active user!", 404);

    const announcementFound = await announcementRepo.findOne({
      where: {
        id: announcementId,
      },
      relations: {
        user: true,
      },
    });

    if (!announcementFound) throw new AppError("Announcement not found", 404);

    if (announcementFound.user.id !== loggedUser.id) {
      throw new AppError(
        "This announcement does not belong to this seller",
        400
      );
    }

    const updateAnnouncement = await announcementRepo.save({
      ...announcementFound,
      ...payload,
    });

    return announcementSchema.parse(updateAnnouncement);
  }

  async destroy(announcementId: string, userId: string): Promise<void> {
    const announcementRepo = AppDataSource.getRepository(Announcement);
    const userRepo = AppDataSource.getRepository(User);

    const loggedUser = await userRepo.findOneBy({ id: userId });

    if (!loggedUser) throw new AppError("No active user!", 404);

    const announcementFound = await announcementRepo.findOne({
      where: {
        id: announcementId,
      },
      relations: {
        user: true,
      },
    });

    if (!announcementFound) throw new AppError("Announcement not found", 404);

    if (announcementFound.user.id !== loggedUser.id) {
      throw new AppError(
        "This announcement does not belong to this seller",
        400
      );
    }

    await announcementRepo.remove(announcementFound);
  }
}
