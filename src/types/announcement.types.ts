import { z } from "zod";
import {
  announcementSchema,
  announcementSchemaRequest,
  announcementUpdateSchemaRequest,
} from "../schemas/announcement.schema";
import { DeepPartial } from "typeorm";

type TAnnouncement = z.infer<typeof announcementSchema>;

type TAnnouncementRequest = z.infer<typeof announcementSchemaRequest>;

type TAnnouncementUpdateRequest = DeepPartial<
  typeof announcementUpdateSchemaRequest
>;

export { TAnnouncement, TAnnouncementRequest, TAnnouncementUpdateRequest };
