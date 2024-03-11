const db = require("./connection");

const InsertContact = async (email, phone, full_name, msg) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Insert data into the 'contact' table

      db.run(
        "INSERT INTO contact (email, phone, full_name, msg) VALUES (?, ?, ?, ?)",
        [email, phone, full_name, msg],
        (err) => {
          if (err) {
            reject("Error inserting data:", err.message);
          } else {
            console.log("SUcess");
            resolve("Message Sent");
          }
        }
      );
    });
  });
};

const SearchContact = (userInput) => {
    return new Promise((resolve, reject) => {
        db.all(
          "SELECT * FROM contact WHERE email = ? OR phone = ?",
          [userInput, userInput],
          (err, rows) => {
            if (err) {
              console.error("Error searching data:", err.message);
              reject("Error searching data: " + err.message);
            } else {
              resolve(rows);
            }
          }
        );
      });
};

const GetContact = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Insert data into the 'contact' table
      db.all("SELECT * FROM contact", (err, row) => {
        if (err) {
          reject("Error inserting data:", err.message);
        } else {
          resolve(row);
        }
      });
    });
  });
};

module.exports = { InsertContact, GetContact, SearchContact };
