import { IFileStorageDriver, LocalFilesystemDriver, S3Driver } from "./FileStorageDrivers";


export class FileStorage {
    private driver: IFileStorageDriver;

    constructor({ driver }: { driver: IFileStorageDriver }) {
        this.driver = driver;
    }

    async upload(fileName: string, data: Buffer | string): Promise<void> {
        return this.driver.upload(fileName, data);
    }

    async download(fileName: string): Promise<Buffer | string> {
        return this.driver.download(fileName);
    }

    async delete(fileName: string): Promise<void> {
        return this.driver.delete(fileName);
    }

    async list(): Promise<string[]> {
        return this.driver.list();
    }
}

