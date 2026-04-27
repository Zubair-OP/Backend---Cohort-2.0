import ImageKit from 'imagekit';
import { config } from '../config/config.js';

const client = new ImageKit({
    privateKey: config.IMG_KIT_PRIVATE_KEY.trim(),
    publicKey: config.IMG_KIT_PUBLIC_KEY.trim(),
    urlEndpoint: config.IMG_KIT_URL_ENDPOINT.trim()
});

export function uploadImage(fileInput, folder="snitch") {
  const buffer = Buffer.isBuffer(fileInput) ? fileInput : fileInput?.buffer;
  const fileName = fileInput?.originalname || 'image.jpg';

  if (!buffer) {
    throw new Error('A valid image buffer is required for upload.');
  }

  return client.upload({
    file: buffer.toString('base64'),
    fileName,
    folder,
  });
}
