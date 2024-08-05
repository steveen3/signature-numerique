const User = require("../utilis/User");

const bcrypt = require('bcrypt');

const {
    addDocument, 
    findOneDocument,
  } = require("../database");
  
  exports.uploadDocument = async (req, res, next) => {
    const { filename,  file } = req.body;
  
    try {
      // Ajouter le document dans la base de données
      addDocument(filePath);
      
      res.status(201).send({ message: "Document uploaded" });
    } catch (error) {
      next(error);
    }
  };
  