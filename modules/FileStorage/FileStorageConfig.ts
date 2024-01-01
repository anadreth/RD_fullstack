import { LocalFilesystemDriver, S3Driver } from "./classes/FileStorageDrivers";
import { FileStorage } from "./classes/FileStorage";

const fsDriver = new LocalFilesystemDriver({ path: './public' });
const s3Driver = new S3Driver({
  options: {
    endpoint: process.env.S3_ENDPOINT,
    region: 'local',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY ?? '',
      secretAccessKey: process.env.S3_SECRET_KEY ?? ''
    }
  },
  bucketName: 'lesson7'
});

export const fsStorage = new FileStorage({ driver: fsDriver });
export const s3Storage = new FileStorage({ driver: s3Driver });