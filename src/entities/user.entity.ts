import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Address } from "./address.entity";
import { Announcement } from "./announcement.entity";
import { getRounds, hashSync } from "bcryptjs";
import { Comment } from "./comment.entity";

export enum UserType {
  COMPRADOR = "comprador",
  ANUNCIANTE = "anunciante",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "varchar", unique: true, length: 100 })
  email: string;

  @Column({ type: "varchar", unique: true, length: 17 })
  cpf: string;

  @Column({ type: "varchar", length: 15 })
  phone_number: string;

  @Column({ type: "varchar" })
  date_birth: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "enum", enum: UserType })
  account_type: UserType;

  @Column({ type: "varchar", length: 150 })
  password: string;

  @Column({ type: "varchar", length: 150 })
  confirm: string;

  @OneToOne(() => Address, (address) => address.user)
  address: Address;

  @OneToMany(() => Announcement, (announcement) => announcement.user)
  announcements: Announcement[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    const hasRounds: number = getRounds(this.password);
    if (!hasRounds) {
      this.password = hashSync(this.password, 10);
      this.confirm = hashSync(this.confirm, 10);
    }
  }
}
