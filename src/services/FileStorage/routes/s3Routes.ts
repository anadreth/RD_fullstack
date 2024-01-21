
import express from 'express';
import multer from 'multer';
import { s3Storage } from '../FileStorageConfig';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        await s3Storage.upload(file?.originalname ?? '', file?.path ?? '');
        res.status(200).send('File uploaded successfully.');
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/download/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const file = await s3Storage.download(fileName);
        res.status(200).send(file);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/delete/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;
        await s3Storage.delete(fileName);
        res.status(200).send('File deleted successfully.');
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/list', async (req, res) => {
    try {
        const files = await s3Storage.list();
        res.status(200).json(files);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
