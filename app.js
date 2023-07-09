const express = require("express");
const app = express();
const dbconnect = require("./db/connect");
const dotenv = require("dotenv");
dotenv.config();
const errorHandlerMiddleware = require("./middlewares/ErrorHandlerMiddleware");
const noRoute = require("./middlewares/noRoute");
const morgan = require("morgan");
const categoryRoute = require("./routers/category");
const productRoute = require("./routers/product");
const userRoute = require("./routers/user");

// routes
app.use(express.json());
app.use("/api/category", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/user", userRoute);

// middlewares
app.use(morgan("tiny"));

// errorHandlerMiddleware
app.use(errorHandlerMiddleware);

// noRoute
app.use(noRoute);

// listen to port
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
