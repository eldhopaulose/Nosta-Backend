var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const productRouter = require("./routes/product");
const userRouter = require("./routes/users");
const userProductRouter = require("./routes/userProduct");
const cartRouter = require("./routes/cart");
const userLikedRouter = require("./routes/like");
const adressRouter = require("./routes/address");
const orderRouter = require("./routes/order");
const offerRouter = require("./routes/offer");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);

app.use("/users", usersRouter);

// Add the adminRouter to the app
app.use("/api/admin", adminRouter);

// Add the productRouter to the app
app.use("/api/admin/product", productRouter);

// Add the userRouter to the app
app.use("/api/user", userRouter);

// Add the userProductRouter to the app
app.use("/api/product", userProductRouter);

// Add the cartRouter to the app
app.use("/api/cart", cartRouter);

// Add the userLikedRouter to the app
app.use("/api/like", userLikedRouter);

// Add the adressRouter to the app
app.use("/api/adress", adressRouter);

// Add the orderRouter to the app
app.use("/api/order", orderRouter);

app.use("/api/offer", offerRouter);

mongoose
  .connect(process.env.MONG_URI)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.error("Database Connection Error:", err));

module.exports = app;
