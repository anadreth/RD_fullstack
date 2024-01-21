import express from 'express';
import { db } from '../../../database';

const router = express.Router();

router.get('/users/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await db
            .selectFrom('users')
            .select(['username', 'created_at', 'id'])
            .where('id', '=', parseInt(userId))
            .execute();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post('/users/create', async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = await db
            .insertInto('users')
            .values({ username, password })
            .execute();

        res.status(201)
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.put('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    const { username } = req.body;

    try {
        await db
            .updateTable('users')
            .set({ username })
            .where('id', '=', parseInt(userId))
            .execute();

        res.status(200)
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.delete('/users/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await db
            .deleteFrom('users')
            .where('id', '=', parseInt(userId))
            .execute();

        res.status(200)
    } catch (error) {
        res.status(500).json({ error });
    }
});
