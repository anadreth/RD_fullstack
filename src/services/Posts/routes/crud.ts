import express from 'express';
import { db } from '../../../../database';

const router = express.Router();


router.post('/posts/create', async (req, res) => {
    const { content, user_id, image_filename } = req.body;

    try {
        const newPost = await db
            .insertInto('posts').values({content, user_id, image_filename, likes: 0})
            .execute();

        res.status(201);
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.put('/posts/:postId', async (req, res) => {
    const postId = parseInt(req.params.postId);
    try {
        await db
            .updateTable('posts')
            .set(req.body)
            .where('id', '=', postId)
            .execute();
        res.status(200)
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.delete('/posts/:postId', async (req, res) => {
    const postId = parseInt(req.params.postId); try {
        await db
            .deleteFrom('posts')
            .where('id', '=', postId)
            .execute();
        res.status(200)
    } catch (error) {
        res.status(500).json({ error });
    }
});

//posts for feed
router.get('/posts', async (req, res) => {
    const page = parseInt(req.query.page?.toString() || '1');
    const perPage = parseInt(req.query.perPage?.toString() || '10');
    const offset = (page - 1) * perPage;

    try {
        const posts = await db
            .selectFrom('posts')
            .selectAll()
            .orderBy('created_at', 'desc')
            .limit(perPage)
            .offset(offset)
            .execute();

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error });
    }
});
