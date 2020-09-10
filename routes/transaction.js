const router = require("express").Router();
// const Product = require("./../models/Product");
const multer = require("multer");
const passport = require("passport");

const adminOnly = (req, res, next) => {
   if (req.user.isAdmin) {
      next();
   } else {
      res.status(403).send({
         error: "Forbidden",
      });
   }
};

//! transaction Index Endpoint
router.get("/", (req, res, next) => {
   res.send("transaction Index Endpoint");
});

//! Create transaction Endpoint
router.post("/", (req, res, next) => {
   res.send("Create transaction Endpoint");
});

//! transaction Single Endpoint
router.get("/:transactionId", (req, res, next) => {
   res.send("transaction Single Endpoint");
});

//! transaction Update Endpoint
router.put("/:transactionId", (req, res, next) => {
   res.send("transaction Update Endpoint");
});

module.exports = router;
