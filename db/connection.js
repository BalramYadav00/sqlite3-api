const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "./db.sqlite3",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) {
      console.log("me running");
      console.error(err.message);
    }
    console.log("Connected to the newsletter database.");
  }
);
// db.serialize(() => {
//   // Create the 'newsletter' table
//   db.run(`
//         CREATE TABLE IF NOT EXISTS newsletter (
//           id INTEGER PRIMARY KEY,
//           email TEXT NOT NULL
//         )
//       `);
// });


module.exports = db;
