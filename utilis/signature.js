// utils/signature.js

const crypto = require('crypto');
const { privateKey, publicKey } = require('./keys');

// Fonction pour signer un document
const signDocument = (document) => {
  const sign = crypto.createSign('SHA256');
  sign.update(document);
  sign.end();

  return sign.sign(privateKey, 'hex');
};

// Fonction pour vérifier un document
const verifyDocument = (document, signature) => {
  const verify = crypto.createVerify('SHA256');
  verify.update(document);
  verify.end();
  return verify.verify(publicKey, signature, 'hex');
};

module.exports = {
  signDocument,
  verifyDocument
};
