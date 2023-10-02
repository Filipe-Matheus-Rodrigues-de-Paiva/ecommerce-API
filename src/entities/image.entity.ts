import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Announcement } from "./announcement.entity";

@Entity("images")
export class Image {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  ImageUrl: string;

  @ManyToOne(() => Announcement, (announcement) => announcement.images, {
    onDelete: "CASCADE",
  })
  announcement: Announcement;
}
