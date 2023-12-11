import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export type JwtPayload = {
    username: string
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization
    if (authHeader == null) return res.sendStatus(401)

    const token = authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    if (JWT_SECRET == null) return res.sendStatus(401)
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403)
        req.user = decoded as JwtPayload
        next()
    })
}