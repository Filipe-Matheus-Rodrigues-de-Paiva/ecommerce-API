import { NextFunction, Request, Response } from "express"
import { z } from "zod"

const validateBody = (schema: z.AnyZodObject) => (request: Request, response: Response, next: NextFunction) => {
    const validatedBody = schema.parse(request.body)
    response.locals = {...response.locals, validatedBody}
    
    next()
}

export default validateBody