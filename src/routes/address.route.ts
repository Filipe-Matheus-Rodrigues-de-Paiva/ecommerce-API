import { Router } from "express";
import { addressController } from "../controllers";
import middlewares from "../middlewares";

const addressRoutes: Router = Router();

addressRoutes.patch("", middlewares.verifyToken, (req, res) =>
  addressController.update(req, res)
);

export default addressRoutes;
