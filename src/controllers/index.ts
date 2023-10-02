import { AddressService } from "../services/address.services";
import { AnnouncementService } from "../services/announcement.services";
import { CommentService } from "../services/comment.services";
import { SessionService } from "../services/session.services";
import { UserService } from "../services/user.services";
import { AddressController } from "./address.controller";
import { AnnouncementController } from "./announcement.controller";
import { CommentController } from "./comment.controller";
import { SessionController } from "./session.controller";
import { UserController } from "./user.controller";

// Announcements
const announcementService = new AnnouncementService();
const announcementController = new AnnouncementController(announcementService);

// Users
const userService = new UserService();
const userController = new UserController(userService);

// Address
const addressService = new AddressService();
const addressController = new AddressController(addressService);

// Session
const sessionService = new SessionService();
const sessionController = new SessionController(sessionService);

// Comments
const commentService = new CommentService();
const commentController = new CommentController(commentService);

export {
  announcementController,
  userController,
  addressController,
  sessionController,
  commentController,
};
