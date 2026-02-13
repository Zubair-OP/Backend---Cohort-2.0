const imagekit = require('imagekit');

const client = new imagekit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'],
  publicKey: process.env['IMAGEKIT_PUBLIC_KEY'],
  urlEndpoint: process.env['IMAGEKIT_URL_ENDPOINT'],
});

function uploadFile(buffer) {
  return client.upload({
    file: buffer.toString('base64'),
    fileName: 'image.jpg',
  });
}

function deleteFile(fileId) {
  return client.deleteFile(fileId);
}

module.exports = { 
  uploadFile,
  deleteFile
};