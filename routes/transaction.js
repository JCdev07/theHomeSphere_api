const router = require("express").Router();
// const Product = require("./../models/Product");
const multer = require("multer");
const passport = require("passport");

// Multer
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "assets/images");
   },
   filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
   },
});

const upload = multer({ storage: storage });

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
