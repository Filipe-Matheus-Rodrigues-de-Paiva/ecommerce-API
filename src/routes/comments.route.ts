import { Router } from "express";
import { commentController } from "../controllers";
import middlewares from "../middlewares";
import { commentPayloadSchema } from "../schemas/comment.schema";

const commentRoutes: Router = Router();

commentRoutes.post(
  "/announcements/:announcementId",
  middlewares.verifyToken,
  middlewares.validateBody(commentPayloadSchema),
  (req, res) => commentController.create(req, res)
);

commentRoutes.get(
  "/announcements/:announcementId",
  middlewares.verifyToken,
  (req, res) => commentController.read(req, res)
);

commentRoutes.patch("/:commentId", middlewares.verifyToken, (req, res) =>
  commentController.update(req, res)
);

commentRoutes.delete("/:commentId", middlewares.verifyToken, (req, res) =>
  commentController.destroy(req, res)
);

export default commentRoutes;
