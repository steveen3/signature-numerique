const sqlite3 = require("sqlite3").verbose();

const crypto = require("crypto");
const db = new sqlite3.Database("database.db");

const UserSchema = {
  tableName: "document",
  properties: {
    id: { type: "INTEGER", primaryKey: true, autoIncrement: true },
    filename: { type: "TEXT" },
    file: { type: "BLOB" },
    created_at :{typr:"DATETIME DEFAULT CURRENT_TIMESTAMP"}
  },
};

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS ${UserSchema.tableName} (
      ${Object.entries(UserSchema.properties)
        .map(
          ([columnName, column]) =>
            `${columnName} ${column.type}${
              column.primaryKey ? " PRIMARY KEY" : ""
            }${column.autoIncrement ? " AUTOINCREMENT" : ""}`
        )
        .join(",\n")}
    )`);
});

const document = {
  save: function () {
    const document = this;

    const insertQuery = `INSERT INTO ${UserSchema.tableName} (${Object.keys(
      UserSchema.properties
    ).join(", ")})
        VALUES (${Object.keys(UserSchema.properties)
          .map(() => "?")
          .join(", ")})`;
    const values = Object.values(UserSchema.properties).map(
      (column) => plante[column]
    );
    db.run(insertQuery, values, function (err) {
      if (err) {
        console.error(err);
      }
    });
  },
};

module.exports = { document };
