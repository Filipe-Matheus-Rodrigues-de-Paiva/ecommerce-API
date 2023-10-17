import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Image } from "./image.entity";
import { Comment } from "./comment.entity";

export enum FuelingType {
  GASOLINA = "gasolina",
  ETANOL = "etanol",
}

@Entity("announcements")
export class Announcement {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 50 })
  brand: string;

  @Column({ type: "varchar", length: 100 })
  model: string;

  @Column()
  year: number;

  @Column({ type: "enum", enum: FuelingType })
  fueling: FuelingType;

  @Column()
  kilometers: number;

  @Column({ type: "varchar", length: 20 })
  color: string;

  @Column({ type: "varchar" })
  fipe_price: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  coverImage: string;

  @OneToMany(() => Image, (image) => image.announcement)
  images: Image[] | undefined | null;

  @ManyToOne(() => User, (user) => user.announcements)
  user: User;

  @OneToMany(() => Comment, (comment) => comment.announcement)
  comments: Comment[];
}
