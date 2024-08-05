// routes/document.js

const express = require('express');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { signDocument, verifyDocument } = require('../utilis/signature');
const { addDocument}= require("../database")

const router = express.Router();

// Middleware pour vérifier l'existence des répertoires
const checkDirectories = (req, res, next) => {
  const signedDocsDir = path.join(__dirname, '..', 'signed_docs');
  const signaturesDir = path.join(__dirname, '..', 'signatures');
  
  if (!fs.existsSync(signedDocsDir)) {
    fs.mkdirSync(signedDocsDir);
  }
  
  if (!fs.existsSync(signaturesDir)) {
    fs.mkdirSync(signaturesDir);
  }
  
  next();
};


// Route pour l'importation de documents
router.post('/upload', checkDirectories, (req, res) => {
  const form = new formidable.IncomingForm({ uploadDir: 'uploads', keepExtensions: true });
  addDocument(form)

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erreur lors du traitement du formulaire.');
    }

    const file = files.document;
    if (!file) {
      return res.status(400).send('Aucun fichier n\'a été téléchargé.');
    }

    const filePath = file.path;
    const document = fs.readFileSync(filePath);
    addDocument(filePath)
    

    // Signer le document
    const signature = signDocument(document);

    // Sauvegarder le document et la signature
    const signedFilePath = path.join(__dirname, '..', 'signed_docs', path.basename(filePath));
    const signaturePath = path.join(__dirname, '..', 'signatures', `${path.basename(filePath)}.sig`);

    fs.writeFileSync(signedFilePath, document);
    fs.writeFileSync(signaturePath, signature);

    res.status(200).send({
      message: 'Document téléchargé et signé avec succès.',
      file: path.basename(filePath),
      signature: signature
    });
  });
});



module.exports = router;
