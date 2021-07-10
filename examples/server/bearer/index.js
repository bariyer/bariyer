// @ts-check

const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
console.clear();

const { middlewares, DotEnvError } = require("@koauth/server");
const { login, register } = require("./controllers");

const app = express();
app.use(express.urlencoded({ extended: false }));
const port = 3001;

app.post("/login", login);
app.post("/register", register);

if (!process.env.JWT_SECRET_KEY) {
  throw new DotEnvError("JWT_SECRET_KEY");
}

app.use(middlewares.bearerAuth(process.env.JWT_SECRET_KEY));

app.get("/", (req, res) => {
  res.status(200).send([
    {
      id: 1,
      name: "Milk",
    },
    {
      id: 2,
      name: "Cheese",
    },
  ]);
});

app.listen(port, () => {
  console.info(
    `Example express server for bearer auth listening at http://localhost:${port}`
  );
});
