const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");
const bcrypt = require('bcrypt');

// Crée la table "users" si elle n'existe pas déjà
const createTable = () => {
  db.run(`
      CREATE TABLE IF NOT EXISTS utilisateur (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        email TEXT,
        password TEXT
      )
      
    `);

  db.run(`
    CREATE TABLE IF NOT EXISTS document (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      file BLOB NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    )
  `);
};

// creee la table document


// Crée un nouvel utilisateur dans la base de données
function createUser(username, email, hashedPassword) {
    db.get(
      `SELECT * FROM utilisateur WHERE email = ?`,
      [email],
      function (err, row) {
        if (err) {
          console.error(err.message);
        } else if (row) {
          console.log(`Utilisateur avec l'email ${email} existe déjà.`);
        } else {
          db.run(
            `INSERT INTO utilisateur (username, email, password) VALUES (?, ?, ?)`,
            [username, email, hashedPassword], // Utilisez le mot de passe haché au lieu du mot de passe en texte brut
            function (err) {
              if (err) {
                console.error(err.message);
              } else {
                console.log(
                  `Utilisateur ${username} avec l'ID ${this.lastID} a été créé.`
                );
              }
            }
          );
        }
      }
    );
  }
  
  //nouveau document en base de donnees
  const fs = require('fs');

const addDocument = async (filePath) => {
  if (!filePath) {
    console.error("Erreur : filePath est indéfini ou invalide.");
    return;
  }

  const filename = filePath.split('/').pop(); // Extraction du nom du fichier à partir du chemin

  try {
    const row = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM document WHERE filename = ?`, [filename], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (row) {
      console.log(`Document avec le nom ${filename} existe déjà.`);
    } else {
      // Lecture du fichier en utilisant fs
      const fileData = await new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });

      const result = await new Promise((resolve, reject) => {
        db.run(`INSERT INTO document (filename, file) VALUES (?, ?)`, [filename, fileData], function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.lastID);
          }
        });
      });

      console.log(`Document ${filename} avec l'ID ${result} a été ajouté.`);
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du document :", error.message);
  }
};

  
  
  
  // Cherche un utilisateur dans la base de données en fonction de l'email
  const findOneUser = (username) => {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM utilisateur WHERE username = ?",
        username,
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  };
//chercher documents
function findOneDocument(filename) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM document WHERE filename = ?`,
      [filename],
      function (err, row) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      }
    );
  });
}
  
console.log("SQLite3 Connected");

module.exports = {
  
  createUser,
  createTable,
  addDocument,

  
  findOneUser,
  findOneDocument
};