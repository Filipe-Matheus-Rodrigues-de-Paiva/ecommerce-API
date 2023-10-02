import { Router } from "express";
import { announcementController } from "../controllers";
import middlewares from "../middlewares";
import { announcementSchemaRequest } from "../schemas/announcement.schema";

const announcementRoutes: Router = Router();

announcementRoutes.post(
  "",
  middlewares.validateBody(announcementSchemaRequest),
  middlewares.verifyToken,
  middlewares.verifyUserPermission,
  (req, res) => announcementController.create(req, res)
);

announcementRoutes.get("", (req, res) => announcementController.list(req, res));

announcementRoutes.get("/:announcementId", (req, res) =>
  announcementController.retrieve(req, res)
);

announcementRoutes.get("/users/:userId", (req, res) =>
  announcementController.listByUser(req, res)
);

announcementRoutes.patch(
  "/:announcementId",
  middlewares.verifyToken,
  (req, res) => announcementController.update(req, res)
);

announcementRoutes.delete(
  "/:announcementId",
  middlewares.verifyToken,
  (req, res) => announcementController.destroy(req, res)
);

export default announcementRoutes;
