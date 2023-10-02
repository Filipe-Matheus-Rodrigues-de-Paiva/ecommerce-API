import { Router } from "express";
import { sessionController } from "../controllers";
import middlewares from "../middlewares";
import { sessionSchema } from "../schemas/session.schemas";

const sessionRoutes: Router = Router();

sessionRoutes.post("", middlewares.validateBody(sessionSchema), (req, res) =>
  sessionController.create(req, res)
);

export default sessionRoutes;
