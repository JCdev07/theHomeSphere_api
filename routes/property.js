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

//! Property Index Endpoint
router.get("/", (req, res, next) => {
   res.send("Property Index Endpoint");
});

//! Create Property Endpoint
router.post("/", (req, res, next) => {
   res.send("Create Property Endpoint");
});

//! Property Single Endpoint
router.get("/:propertyId", (req, res, next) => {
   res.send("Property Single Endpoint");
});

//! Property Update Endpoint
router.put("/:propertyId", (req, res, next) => {
   res.send("Property Update Endpoint");
});

//! Property Delete Endpoint
router.delete("/:propertyId", (req, res, next) => {
   res.send("Property Delete Endpoint");
});

module.exports = router;
