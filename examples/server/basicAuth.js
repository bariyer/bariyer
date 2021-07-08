const express = require("express");
const { middlewares } = require("@koauth/server");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

app.use(middlewares.basicAuth("test", "test123"));

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
  console.log(`Example app listening at http://localhost:${port}`);
});
