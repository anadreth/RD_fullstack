
import express from 'express';
import multer from 'multer';
import { fsStorage } from '../FileStorageConfig';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        await fsStorage.upload(file?.originalname ?? '', file?.path ?? '');
        res.status(200).send('File uploaded successfully.');
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/download/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;
        const file = await fsStorage.download(fileName);
        res.status(200).send(file);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete('/delete/:fileName', async (req, res) => {
    try {
        const fileName = req.params.fileName;
        await fsStorage.delete(fileName);
        res.status(200).send('File deleted successfully.');
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/list', async (req, res) => {
    try {
        const files = await fsStorage.list();
        res.status(200).json(files);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;
