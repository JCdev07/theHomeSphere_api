const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// Routes
const categories = require("./routes/category");
const properties = require("./routes/property");
const users = require("./routes/user");
const transactions = require("./routes/transaction");
const booking = require("./routes/booking");
const contacts = require("./routes/contact");

require("dotenv").config();

// Mongoose Connection
mongoose.connect("mongodb://localhost:27017/homesphere", {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: true,
});

mongoose.connection.on("error", () => {
   console.error.bind(console, "connected to database:");
});
mongoose.connection.on("open", () => {
   console.log("connected to database");
});

// Middleware
app.use(express.json());
app.use(cors());

// Middleware fo saving images
app.use("/public", express.static("assets/images"));

// Middleware for routes
app.use("/", users);
app.use("/categories", categories);
app.use("/properties", properties);
app.use("/transactions", transactions);
app.use("/booking", booking);
app.use("/contact", contacts);

// router Level Middleware
app.use("/", (req, res, next) => {
   res.send(`${req.method} ${req.originalUrl} ${new Date(Date.now())}`);
   console.log(`${req.method} ${req.originalUrl} ${new Date(Date.now())}`);
   next();
});

// error handling middleware
app.use((err, req, res, next) => {
   console.log(err.message);
   res.status(400).json({
      request: "failed",
      error: err.message,
   });
});

// this will run the application on the desired port
app.listen(port, () => {
   console.log(`Example app listening at port: ${port}`);
});
