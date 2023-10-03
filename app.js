const express = require("express");
const app = express();
const cors = require("cors");
const bodyParse = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const db = require("./config/db");
db.connection;
// require("./config/db").connection;

app.use(express.json());
app.use(bodyParse.urlencoded({ extended: true }));
app.use(bodyParse.json());
app.use(cors());
app.use(cookieParser());

const userRouter = require("./routes/customer/customer.routes");
app.use("/user", userRouter);

const selfPurchaseReward = require("./routes/selfPurchaseReward/selfPurchaseReward.routes");
app.use("/selfPurchaseReward", selfPurchaseReward);

const productRouter = require("./routes/product/product.router");
app.use("/product", productRouter);

const wishlist = require("./routes/wishlist/wishlist.router");
app.use("/wishlist", wishlist);

const bagrouter = require("./routes/addToBag/addToBag.route");
app.use("/bag", bagrouter);

const contactUs = require("./routes/contactUs/contactUs.routes");
app.use("/contact", contactUs);

const productOrder = require("./routes/productOrder/productOrder.routes");
app.use("/productorder", productOrder);

module.exports = { app };
