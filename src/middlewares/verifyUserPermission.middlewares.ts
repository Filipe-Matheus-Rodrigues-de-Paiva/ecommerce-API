import { NextFunction, Request, Response } from "express";
import AppError from "../error";

const verifyUserPermission = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { account_type } = response.locals.decoded;

  if (account_type !== "anunciante") {
    throw new AppError("Insufficient permission", 403);
  }

  return next();
};

export default verifyUserPermission;
