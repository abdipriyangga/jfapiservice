require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT;
const mainRouter = require("./src/routes/index");
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:6969",
      "https://jannahfirdaus.com",
      "https://nest.jannahfirdaus.com",
      "https://api.jfinternational.net",
      "https://admin.jannahfirdaus.com"
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(process.env.APP_UPLOAD_ROUTE, express.static("public/pictures"));
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

app.use("/", mainRouter);
module.exports = app;
