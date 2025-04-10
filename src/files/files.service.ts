import { Injectable, ConflictException } from '@nestjs/common';
import { CloudinaryService } from 'nestjs-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import * as bufferToStream from 'buffer-to-stream';

@Injectable()
export class FilesService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  // For HTTP (multipart/form-data)
  async uploadFile(file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }

  // For base64 string (used in WebSocket)
  async uploadBase64(base64: string, filename = 'imgUrl'): Promise<any> {
    try {
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'products', // Optional: adjust folder as needed
            public_id: filename,
          },
          (error, result) => {
            if (error) {
              console.error('Upload error:', error);
              return reject(new ConflictException('File processing failed'));
            }
            resolve(result);
          },
        );

        bufferToStream(buffer).pipe(stream);
      });
    } catch (err) {
      console.error('Error uploading to Cloudinary:', err);
      throw new ConflictException('File processing failed');
    }
  }
}
