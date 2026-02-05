const ImageKit = require('imagekit');

const client = new ImageKit({
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

async function deleteMultipleFiles(fileIds) {
  const deletePromises = fileIds.map(fileId => client.deleteFile(fileId));
  return Promise.all(deletePromises);
}

function getFileDetails(fileId) {
  return client.getFileDetails(fileId);
}

module.exports = { 
  uploadFile, 
  deleteFile, 
  deleteMultipleFiles,
  getFileDetails 
};