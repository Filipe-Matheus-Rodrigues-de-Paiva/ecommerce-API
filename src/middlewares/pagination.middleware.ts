/* import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { TCourseRepository } from "../interfaces"
import { Course } from "../entities"

const pagination = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    const queryPage: number = Number(request.query.page)
    const queryPerPage: number = Number(request.query.perPage)

    const page: number = queryPage && queryPage > 1 ? queryPage : 1
    const perPage: number = queryPerPage && queryPerPage <= 2 && queryPerPage > 0 ? queryPerPage : 2
    
    const courseRepo: TCourseRepository = AppDataSource.getRepository(Course)
    const [courses, totalCount] = await courseRepo.findAndCount({
        take: perPage,
        skip: (page - 1) * perPage,
        relations: { contents: true, studentsCourses: { student: true } },
        select: { id: true, name: true, status: true, start_date: true, end_date: true, contents: true, studentsCourses: { id: true, student: { id: true, username: true, email: true }, status: true } }
    })

    const baseUrl: string = "http://localhost:3000/api/courses"
    const prevPage: string | null = page > 1 ? `${baseUrl}?page=${page - 1}&perPage=${perPage}` : null
    const nextPage: string | null = totalCount > perPage * page ? `${baseUrl}?page=${page + 1}&perPage=${perPage}` : null

    response.locals = {
        ...response.locals,
        pagination: {
            count: totalCount,
            next: nextPage,
            previous: prevPage,
            results: courses
        }
    }

    return next()
}

export default pagination */
