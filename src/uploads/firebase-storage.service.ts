import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseStorageService {
  constructor() {
    const serviceAccount = require('/app/poised-shift-422808-d9-firebase-adminsdk-7mpf9-965a8b765c.json');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
  }

  public async uploadFile(file: any): Promise<string> {
    const bucket = admin.storage().bucket();
    const fileUpload = bucket.file(file.originalname);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('finish', async () => {
        try {
          // Make the file public
          await fileUpload.makePublic();
          resolve(
            `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileUpload.name}`,
          );
        } catch (error) {
          reject(error);
        }
      });
      stream.on('error', (error) => {
        reject(error);
      });
      stream.end(file.buffer);
    });
  }
}
