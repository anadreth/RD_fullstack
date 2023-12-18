import sharp from "sharp";
import { v4 as uuidV4 } from "uuid";
import { Buffer } from 'buffer';

export const generateImagePath = (): string => {
    const imageId = uuidV4();
    return `uploads/${imageId}.png`;
}

export const processAndSaveImage = async (input: Buffer | string, outputPath: string): Promise<string> => {
  await sharp(input)
    .resize(1000, 1000, { fit: 'inside' })
    .toFile(outputPath);
  return outputPath;
}

  