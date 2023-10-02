import { NextFunction, Request, Response } from "express";
import AppError from "../error";

const verifyOwnership = (
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  const { sub } = response.locals.decoded;
  const { userId } = request.params;

  if (sub !== userId) {
    throw new AppError("Insufficient permission", 403);
  }

  return next();
};

export default verifyOwnership;
