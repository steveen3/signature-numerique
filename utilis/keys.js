// utils/keys.js

const fs = require('fs');
const path = require('path');

// Chargement des clés RSA
const privateKey = fs.readFileSync(path.join(__dirname, '..', 'private_key.pem'), 'utf8');
const publicKey = fs.readFileSync(path.join(__dirname, '..', 'public_key.pem'), 'utf8');

module.exports = {
  privateKey,
  publicKey
};
