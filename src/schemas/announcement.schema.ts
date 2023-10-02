import { z } from "zod";
import { FuelingType } from "../entities/announcement.entity";

const imageSchema = z.object({
  id: z.string(),
  imageUrl: z.string().optional(),
});

const imagePayloadSchema = z.object({
  imageUrl: z.string(),
});

const announcementSchema = z.object({
  id: z.string(),
  brand: z.string().max(50),
  model: z.string().max(100),
  year: z.number(),
  fueling: z.nativeEnum(FuelingType),
  kilometers: z.number(),
  color: z.string().max(20),
  fipe_price: z.string(),
  description: z.string(),
  coverImage: z.string(),
  images: z.array(imageSchema).optional().nullable(),
});

const announcementSchemaRequest = z.object({
  brand: z.string().max(50),
  model: z.string().max(100),
  year: z.number(),
  fueling: z.nativeEnum(FuelingType),
  kilometers: z.number(),
  color: z.string().max(20),
  fipe_price: z.string(),
  description: z.string(),
  coverImage: z.string(),
  images: z.array(imagePayloadSchema).optional().nullable(),
});

const announcementUpdateSchemaRequest = announcementSchemaRequest.partial();

export {
  announcementSchema,
  announcementSchemaRequest,
  announcementUpdateSchemaRequest,
};
