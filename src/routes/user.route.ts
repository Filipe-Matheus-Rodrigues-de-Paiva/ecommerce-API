import { Router } from "express";
import { userController } from "../controllers";
import middlewares from "../middlewares";
import { userSchemaRequest } from "../schemas/user.schema";

const userRoutes: Router = Router();

userRoutes.post("", middlewares.validateBody(userSchemaRequest), (req, res) =>
  userController.create(req, res)
);

userRoutes.get("/:userId", (req, res) => userController.retrieve(req, res));

userRoutes.patch(
  "/:userId",
  middlewares.verifyToken,
  middlewares.verifyOwnership,
  (req, res) => userController.update(req, res)
);

userRoutes.delete(
  "/:userId",
  middlewares.verifyToken,
  middlewares.verifyOwnership,
  (req, res) => userController.destroy(req, res)
);

export default userRoutes;
