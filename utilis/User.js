const sqlite3 = require("sqlite3").verbose();


const crypto = require("crypto");
const db = new sqlite3.Database("database.db");


const UserSchema = {
    tableName: "utilisateur",
    properties: {
      id: { type: "INTEGER", primaryKey: true, autoIncrement: true },
      username: { type: "TEXT" },
      email: { type: "TEXT" },
      password: { type: "TEXT" },
      
    },
   
    

  };
  
  // Créez la table utilisateur dans la base de données SQLite3
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS ${UserSchema.tableName} (
      ${Object.entries(UserSchema.properties)
        .map(([columnName, column]) => `${columnName} ${column.type}${column.primaryKey ? " PRIMARY KEY" : ""}${column.autoIncrement ? " AUTOINCREMENT" : ""}`)
        .join(",\n")}
    )`);
  });
 
  // Exportez le modèle utilisateur
  const User = {
    save: function () {
      const user = this;
  
      const insertQuery = `INSERT INTO ${UserSchema.tableName} (${Object.keys(UserSchema.properties).join(", ")})
        VALUES (${Object.keys(UserSchema.properties).map(() => "?").join(", ")})`;
      const values = Object.values(UserSchema.properties).map(column => user[column]);
      db.run(insertQuery, values, function (err) {
        if (err) {
          console.error(err);
        }
      });
    }
  };

  

 
  
  module.exports = {User};