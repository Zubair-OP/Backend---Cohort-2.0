import ImageKit from 'imagekit';
import { config } from '../config/config.js';

const client = new ImageKit({
    privateKey: config.IMG_KIT_PRIVATE_KEY.trim(),
    publicKey: config.IMG_KIT_PUBLIC_KEY.trim(),
    urlEndpoint: config.IMG_KIT_URL_ENDPOINT.trim()
});


export function uploadImage(buffer, folder="snitch") {
  return client.upload({
    file: buffer.toString('base64'),
    fileName: 'image.jpg',
    folder,
  });
}