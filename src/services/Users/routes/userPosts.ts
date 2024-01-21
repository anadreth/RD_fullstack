import express from 'express';
import { db } from '../../../../database';

const router = express.Router();

router.get('/users/:userId/posts', async (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const page = parseInt(req.query.page?.toString() || '1');
  const perPage = parseInt(req.query.perPage?.toString() || '10');
  const offset = (page - 1) * perPage;

  try {
    const posts = await db
      .selectFrom('posts')
      .selectAll()
      .where('user_id', '=', userId)
      .orderBy('created_at', 'desc')
      .limit(perPage)
      .offset(offset)
      .execute();

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error });
  }
});