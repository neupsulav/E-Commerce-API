const express = require("express");
const app = express();

const dbconnect = require("./connection/connect");

const dotenv = require("dotenv");
dotenv.config();

const listen = async () => {
  try {
    await dbconnect(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening to port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

listen();
