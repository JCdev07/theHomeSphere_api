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
router.get(
   "/",
   passport.authenticate("jwt", { session: false }),
   (req, res, next) => {
      console.log(req.user);
      res.send("transaction Index Endpoint");
   }
);

//! Create transaction Endpoint
router.post(
   "/",
   passport.authenticate("jwt", { session: false }),
   (req, res, next) => {
      res.send("Create transaction Endpoint");
   }
);

//! transaction Single Endpoint
router.get(
   "/:transactionId",
   passport.authenticate("jwt", { session: false }),
   (req, res, next) => {
      res.send("transaction Single Endpoint");
   }
);

//! transaction Update Endpoint
router.put(
   "/:transactionId",
   passport.authenticate("jwt", { session: false }),
   adminOnly,
   (req, res, next) => {
      res.send("transaction Update Endpoint");
   }
);

module.exports = router;
