import { NextFunction, Request, Response } from "express"
import AppError from "../error"
import { verify } from "jsonwebtoken"

const verifyToken = (request: Request, response: Response, next: NextFunction): void => {
    const authorization: string | undefined = request.headers.authorization
    if (!authorization) throw new AppError("Missing bearer token", 401)

    const token: string = authorization.split(" ")[1]
    
    verify(token, process.env.SECRET_KEY!, (err, decoded) => {
        if (err) throw new AppError(err.message, 401)
        
        response.locals = {...response.locals, decoded}
    })

    return next()
}

export default verifyToken