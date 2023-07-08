const mongoose = require("mongoose");

const connect = async (url) => {
  return mongoose
    .connect(url)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connect;
