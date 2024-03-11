const db = require("./connection");

const Insert = async (email) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Insert data into the 'newsletter' table

      db.run("INSERT INTO newsletter (email) VALUES (?)", email, (err) => {
        if (err) {
          reject("Error inserting data:", err.message);
        } else {
          resolve("Congratulations! You are now a subscriber");
        }
      });
    });
  });
};

const Search = (email) => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM newsletter WHERE email = ?", [email], (err, row) => {
      if (err) {
        console.error("Error finding data:", err.message);
        reject("Error finding data: " + err.message);
      } else {
        resolve(row);
      }
    });
  });
};

const Get = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Insert data into the 'newsletter' table
      db.all("SELECT * FROM newsletter", (err, row) => {
        if (err) {
          reject("Error inserting data:", err.message);
        } else {
          resolve(row);
        }
      });
    });
  });
};
const Delete = () => {};

module.exports = { Insert, Delete, Get, Search };
