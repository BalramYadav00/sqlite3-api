const Koa = require("koa");
const Router = require("@koa/router");
const { koaBody } = require("koa-body");
const app = new Koa();
const { Insert, Get, Search } = require("./db/NewsLetter");
const { InsertContact, GetContact, SearchContact } = require("./db/ContactAPI");
const db = require("./db/connection");

const router = new Router();
app.use(koaBody({ multipart: true }));
app.use(router.routes());
app.use(router.allowedMethods());
// Database
db.serialize(() => {
  // Create the 'newsletter' table
  db.run(`
        CREATE TABLE IF NOT EXISTS newsletter (
          id INTEGER PRIMARY KEY,
          email TEXT NOT NULL
        )
      `);
});

db.serialize(() => {
  // Create the 'newsletter' table
  db.run(`
          CREATE TABLE IF NOT EXISTS contact (
           id INTEGER PRIMARY KEY,
           email TEXT,
           phone INTEGER CHECK(LENGTH(phone) <= 10),
           full_name TEXT,
           msg TEXT
          )
        `);
});

router.get("/", async (ctx) => {
  ctx.body = "Hello world";
});
// Put data to newsletter
router.post("/newsletter", async (ctx) => {
  const { email } = ctx.request.body;
  if (!email || email.trim() === "") {
    ctx.status = 400;
    ctx.body = { message: "Email is required" };
    return;
  }
  let data = await Insert(email);
  try {
    ctx.body = { message: data };
  } catch (err) {
    console.error("Error:", err);
    ctx.status = 500;
    ctx.body = { message: err };
  }
});

// get data from newsletter
router.get("/newsletter", async (ctx) => {
  let data = await Get();
  try {
    console.log(data);
    ctx.status = 200;
    ctx.body = { message: data };
  } catch (err) {
    console.error("Error:", err);
    ctx.status = 500;
    ctx.body = { message: err };
  }
});

// Search data in newsletter
router.post("/newsletter/search", async (ctx) => {
  const { email } = ctx.request.body;
  if (!email || email.trim() === "") {
    ctx.status = 400;
    ctx.body = { message: "Email is required" };
    return;
  }
  let data = await Search(email);
  try {
    ctx.status = 200;
    ctx.body = { message: data };
  } catch (err) {
    console.error("Error:", err);
    ctx.status = 500;
    ctx.body = { message: err };
  }
});

// Post data for contact
router.post("/contact", async (ctx) => {
  const { email, phone, fullName, msg } = ctx.request.body;
  if (!email || email.trim() === "") {
    ctx.status = 400;
    ctx.body = { message: "Email is required" };
    return;
  } else if (!phone || phone.trim === "") {
    ctx.status = 400;
    ctx.body = { message: "Phone is required" };
    return;
  } else if (!fullName || fullName.trim === "") {
    ctx.status = 400;
    ctx.body = { message: "Full Name is required" };
    return;
  } else if (!msg || msg.trim === "") {
    ctx.status = 400;
    ctx.body = { message: "Msg is required" };
    return;
  }
  let data = await InsertContact(email, phone, fullName, msg);
  try {
    ctx.body = { message: data };
  } catch (err) {
    console.error("Error:", err);
    ctx.status = 500;
    ctx.body = { message: err };
  }
});

// Get data from Contact
router.get("/contact", async (ctx) => {
  let data = await GetContact();
  try {
    console.log(data);
    ctx.status = 200;
    ctx.body = { message: data };
  } catch (err) {
    console.error("Error:", err);
    ctx.status = 500;
    ctx.body = { message: err };
  }
});

// Search data from Contact
router.post("/contact/search", async (ctx) => {
  const { search } = ctx.request.body;
  if (!search || search.trim() === "") {
    ctx.status = 400;
    ctx.body = { message: "Search field is required" };
    return;
  }
  let data = await SearchContact(search);
  try {
    ctx.status = 200;
    ctx.body = { message: data };
  } catch (err) {
    console.error("Error:", err);
    ctx.status = 500;
    ctx.body = { message: err };
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
