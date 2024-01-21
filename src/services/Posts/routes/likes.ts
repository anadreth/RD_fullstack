import express from 'express';
import { db } from '../../../../database';

const router = express.Router();

router.post('/posts/:postId/like', async (req, res) => {
    const postId = parseInt(req.params.postId);

    try {
        await db.updateTable('posts')
            .set((eb) => ({
                likes: eb('likes', '+', 1)
            }))
            .where('id', '=', postId)
            .executeTakeFirst()

        res.status(200);
    } catch (error) {
        res.status(500).json({ error });
    }
});


router.post('/posts/:postId/unlike', async (req, res) => {
    const postId = parseInt(req.params.postId);

    try {
        const post = await db
            .selectFrom('posts')
            .select('likes')
            .where('id', '=', postId)
            .executeTakeFirst();

        if (post && post.likes > 0) {
            await db.updateTable('posts')
            .set((eb) => ({
                likes: eb('likes', '-', 1)
            }))
            .where('id', '=', postId)
            .executeTakeFirst()
        }

        res.status(200);
    } catch (error) {
        res.status(500).json({ error });;
    }
});
