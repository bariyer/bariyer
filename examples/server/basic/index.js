const express = require("express");
const path = require("path");

const { middlewares, DotEnvError } = require("@koauth/server");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const app = express();
app.use(express.urlencoded({ extended: false }));

if (!process.env.BASIC_AUTH_USERNAME) {
  throw new DotEnvError("BASIC_AUTH_USERNAME");
}
if (!process.env.BASIC_AUTH_PASSWORD) {
  throw new DotEnvError("BASIC_AUTH_PASSWORD");
}
if (!process.env.PORT) {
  throw DotEnvError("PORT");
}

app.use(
  middlewares.basicAuth(
    process.env.BASIC_AUTH_USERNAME,
    process.env.BASIC_AUTH_PASSWORD
  )
);

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

app.listen(process.env.PORT || 3000, () => {
  console.info(
    `Example express server for basic auth listening at http://localhost:${
      process.env.PORT || 3000
    }`
  );
});
