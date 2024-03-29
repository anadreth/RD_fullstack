import express, { Request, Response, NextFunction, Application } from 'express'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'
import { authenticateToken } from './src/middleware/authToken'
import multer from 'multer'
import { generateImagePath, processAndSaveImage } from './src/helpers'
import { db } from './database'
import bcrypt from 'bcrypt'
import fsRoutes from './src/services/FileStorage/routes/fsRoutes'
import s3Routes from './src/services/FileStorage/routes/s3Routes'

dotenv.config()
const port = process.env.PORT || 3000
const host = process.env.HOST
const JWT_SECRET = process.env.JWT_SECRET

const app: Application = express()

app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'));
const upload = multer({ dest: 'uploads/' }); 

app.use('/fs', fsRoutes);
app.use('/s3', s3Routes);

app.post('/upload-base64', async (req, res) => {
  const { base64Image } = req.body;
  if (!base64Image) {
    return res.status(400).send('No image for upload found');
  }
  if (!base64Image.startsWith('data:image/')) {
    return res.status(400).send('File you are trying to upload is not an image');
  }

  const buffer = Buffer.from(base64Image, 'base64');
  const imagePath = generateImagePath()
  await processAndSaveImage(buffer, imagePath);

  res.send({ imageUrl: `http://localhost:${port}/${imagePath}` });
});

app.post('/upload-formdata', upload.single('image'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No image for upload found');
  }

  if (!file.mimetype.startsWith('image/')) {
    return res.status(400).send('File you are trying to upload is not an image');
  }

  const imagePath = generateImagePath()
  await processAndSaveImage(file.path, imagePath);

  res.send({ url: `http://localhost:${port}/${imagePath}` });
});

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await db
      .selectFrom('users')
      .select(['id', 'username', 'password'])
      .where('username', '=', username)
      .executeTakeFirst();

    if (user && bcrypt.compareSync(password, user.password)) {
      const payload = { username: user.username };

      if (JWT_SECRET) {
        const token = jwt.sign(payload, JWT_SECRET);
        res.json({ token });
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error('Login error:', error);
    res.sendStatus(500); 
  }
});

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