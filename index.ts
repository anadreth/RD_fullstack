import express, { Request, Response, NextFunction, Application } from 'express'
import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bodyParser = require('body-parser')
import { authenticateToken } from './middleware/authToken'
import { users } from './mock/users'

dotenv.config()
const port = process.env.PORT || 3000
const host = process.env.HOST
const JWT_SECRET = process.env.JWT_SECRET

const app: Application = express()

app.use(bodyParser.json())

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body
  const user = users.find(u => u.username === username && u.password === password)

  if (user) {
      const payload: JwtPayload = { username: user.username }

      if (JWT_SECRET != null)  {
        const token = jwt.sign(payload, JWT_SECRET)
        res.json({ token })
      } else {
        res.sendStatus(401)
      }
     
  } else {
      res.sendStatus(401)
  }
})

app.get('/public', (req: Request, res: Response) => {
  res.send('Public content')
})

app.get('/protected', authenticateToken, (req: Request, res: Response) => {
  res.send('Protected content')
})

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!')
})

app.listen(port, () => {
  console.log(`Server is served at http://${host}:${port}`)
})