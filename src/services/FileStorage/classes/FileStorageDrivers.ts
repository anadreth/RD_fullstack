import { promises as fs } from 'fs';
import path from 'path';
import { 
    S3Client, 
    PutObjectCommand, 
    GetObjectCommand, 
    DeleteObjectCommand, 
    ListObjectsCommand, 
    S3ClientConfig
} from "@aws-sdk/client-s3";
import { finished } from 'stream/promises';
import { Readable } from 'stream';

interface LocalFilesystemDriverOptions {
    path: string;
}

export abstract class IFileStorageDriver {
    abstract upload(fileName: string, data: Buffer | string): Promise<void>;
    abstract download(fileName: string): Promise<Buffer | string>;
    abstract delete(fileName: string): Promise<void>;
    abstract list(): Promise<string[]>;
}

export class LocalFilesystemDriver extends IFileStorageDriver {
    private basePath: string;

    constructor(options: LocalFilesystemDriverOptions) {
        super();
        this.basePath = options.path;
    }

    async upload(fileName: string, data: Buffer | string): Promise<void> {
        const filePath = path.join(this.basePath, fileName);
        await fs.writeFile(filePath, data);
    }

    async download(fileName: string): Promise<Buffer | string> {
        const filePath = path.join(this.basePath, fileName);
        return fs.readFile(filePath);
    }

    async delete(fileName: string): Promise<void> {
        const filePath = path.join(this.basePath, fileName);
        await fs.unlink(filePath);
    }

    async list(): Promise<string[]> {
        return fs.readdir(this.basePath);
    }
}

interface S3DriverProps {
    options: S3ClientConfig
    bucketName: string;
}

export class S3Driver extends IFileStorageDriver {
    private s3: S3Client;
    private bucketName: string;

    constructor({options, bucketName}: S3DriverProps) {
        super();
        this.s3 = new S3Client(options);
        this.bucketName = bucketName;
    }

    async upload(fileName: string, data: Buffer | string): Promise<void> {
        const uploadParams = {
            Bucket: this.bucketName,
            Key: fileName,
            Body: data
        };
        await this.s3.send(new PutObjectCommand(uploadParams));
    }

    async download(fileName: string): Promise<Buffer> {
        const downloadParams = {
            Bucket: this.bucketName,
            Key: fileName
        };
        const data = await this.s3.send(new GetObjectCommand(downloadParams));
        const readStream = data.Body as Readable;
        const chunks: Buffer[] = [];
        readStream.on('data', (chunk: Buffer) => chunks.push(chunk));
        await finished(readStream);
        return Buffer.concat(chunks);
    }

    async delete(fileName: string): Promise<void> {
        const deleteParams = {
            Bucket: this.bucketName,
            Key: fileName
        };
        await this.s3.send(new DeleteObjectCommand(deleteParams));
    }

    async list(): Promise<string[]> {
        const listParams = {
            Bucket: this.bucketName
        };
        const data = await this.s3.send(new ListObjectsCommand(listParams));
        return data.Contents?.map(item => item.Key ?? '') ?? [];
    }
}

