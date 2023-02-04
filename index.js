const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.enable("trust proxy");

app.use((req, res, next) => {
  app.get("X-Forwarded-Proto") != "http"
    ? next()
    : res.redirect("https://" + req.headers.host + req.url);
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hey Bionic!!!");
});

const bionicControllerClass = require("./controllers/bionic.controller");
const bionicController = new bionicControllerClass();
const checkIfAuthenticated = require("./middlewares/auth.middleware");
const checkEmailVerified = require("./middlewares/emailVerified.middleware");


app.post(
  "/api/bionic",
  checkIfAuthenticated,
  checkEmailVerified,
  bionicController.convertToBionic
);

app.get(
  "/api/bionic",
  checkIfAuthenticated,
  checkEmailVerified,
  bionicController.test
);

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Listening on :${port}`);
});
